let currentFile = null;
let currentPage = 0;
let state = "upload"; // 'upload', 'filelist', 'title', 'reading', 'filed'
let browsingRE1 = false;

const MAX_LINES_PER_PAGE = 10;
const MAX_CHARS_PER_LINE = 30;

function splitTextIntoPages(text) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const paragraphs = normalized.split(/\n\n+/);
  const pages = [];
  let pageLines = [];

  function estimateLines(str) {
    return str.split("\n").reduce((count, line) => {
      return count + Math.max(1, Math.ceil(line.length / MAX_CHARS_PER_LINE));
    }, 0);
  }

  function flushPage() {
    if (pageLines.length > 0) {
      pages.push({ type: "text", content: pageLines.join("\n\n") });
      pageLines = [];
    }
  }

  for (const para of paragraphs) {
    const trimmed = para.trim();
    const paraVisualLines = estimateLines(trimmed);
    const currentVisualLines = pageLines.length > 0
      ? estimateLines(pageLines.join("\n\n"))
      : 0;

    if (currentVisualLines + paraVisualLines + (pageLines.length > 0 ? 1 : 0) > MAX_LINES_PER_PAGE) {
      flushPage();
    }

    if (paraVisualLines > MAX_LINES_PER_PAGE) {
      const lines = trimmed.split("\n");
      let chunk = [];
      let chunkLines = 0;
      for (const line of lines) {
        const visual = Math.max(1, Math.ceil(line.length / MAX_CHARS_PER_LINE));
        if (chunkLines + visual > MAX_LINES_PER_PAGE && chunk.length > 0) {
          pages.push({ type: "text", content: chunk.join("\n") });
          chunk = [];
          chunkLines = 0;
        }
        chunk.push(line);
        chunkLines += visual;
      }
      if (chunk.length > 0) {
        pageLines.push(chunk.join("\n"));
      }
    } else {
      pageLines.push(trimmed);
    }
  }

  flushPage();
  return pages;
}

function loadFile(name, text) {
  browsingRE1 = false;
  const title = name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ");
  const pages = splitTextIntoPages(text);
  currentFile = { title, pages };
  showTitle();
}

function loadRE1File(reFile) {
  browsingRE1 = true;
  const pages = [];
  if (reFile.image) {
    pages.push({ type: "image", src: reFile.image });
  }
  const textPages = splitTextIntoPages(reFile.text);
  pages.push(...textPages);
  currentFile = { title: reFile.title, pages };
  showTitle();
}

const GAME_FILES = {
  re1: () => typeof RE1_FILES !== "undefined" ? RE1_FILES : [],
  re2: () => typeof RE2_FILES !== "undefined" ? RE2_FILES : [],
  re3: () => typeof RE3_FILES !== "undefined" ? RE3_FILES : [],
};

let selectedGame = "re1";

const GAME_TITLES = {
  re1: "RESIDENT EVIL",
  re2: "RESIDENT EVIL 2",
  re3: "RESIDENT EVIL 3",
};

function showFileList() {
  hideAll();
  fileList.innerHTML = "";
  document.getElementById("file-list-logo").textContent = GAME_TITLES[selectedGame] || "RESIDENT EVIL";
  const files = GAME_FILES[selectedGame]();
  files.forEach((file, index) => {
    const btn = document.createElement("button");
    btn.className = "file-list-item";
    btn.innerHTML = `<span class="arrow right"></span> ${file.title.toUpperCase()}`;
    btn.addEventListener("click", () => {
      re1FileIndex = index;
      loadRE1File(file);
    });
    fileList.appendChild(btn);
  });
  fileListScreen.classList.remove("hidden");
  state = "filelist";
  pushHistory({ screen: "filelist", game: selectedGame });
}

const titleScreen = document.getElementById("title-screen");
const titleText = document.getElementById("title-text");
const titleNextBtn = document.getElementById("title-next-btn");
const pageText = document.getElementById("page-text");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const exitLabel = document.getElementById("exit-label");
const viewer = document.getElementById("file-viewer");
const filedScreen = document.getElementById("filed-screen");
const filedTitle = document.getElementById("filed-title");
const filedSubtitle = document.getElementById("filed-subtitle");
const uploadScreen = document.getElementById("upload-screen");
const fileInput = document.getElementById("file-input");
const fileListScreen = document.getElementById("file-list-screen");
const fileList = document.getElementById("file-list");
const re1FilesLink = document.getElementById("re1-files-link");
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const soundBuffers = {};

async function loadSound(name, src) {
  const response = await fetch(src);
  const arrayBuffer = await response.arrayBuffer();
  soundBuffers[name] = await audioCtx.decodeAudioData(arrayBuffer);
}

function playSound(name) {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const buffer = soundBuffers[name];
  if (!buffer) return;
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start(0);
}

loadSound("pageTurn", "sounds/filefall.wav");
loadSound("exit", "sounds/ending02.wav");

let re1FileIndex = 0;
let pushingHistory = true;

function pushHistory(screenState) {
  if (!pushingHistory) return;
  history.pushState(screenState, "");
}

function restoreState(s) {
  if (!s) return;
  pushingHistory = false;

  if (s.screen === "upload") {
    hideAll();
    uploadScreen.classList.remove("hidden");
    state = "upload";
  } else if (s.screen === "filelist") {
    selectedGame = s.game || selectedGame;
    showFileList();
  } else if (s.screen === "title") {
    if (s.browsingRE1 && s.game && s.fileIndex !== undefined) {
      browsingRE1 = true;
      selectedGame = s.game;
      const files = GAME_FILES[selectedGame]();
      re1FileIndex = s.fileIndex;
      const file = files[re1FileIndex];
      const pages = [];
      if (file.image) pages.push({ type: "image", src: file.image });
      pages.push(...splitTextIntoPages(file.text));
      currentFile = { title: file.title, pages };
    }
    showTitle();
  } else if (s.screen === "reading") {
    if (s.browsingRE1 && s.game && s.fileIndex !== undefined) {
      browsingRE1 = true;
      selectedGame = s.game;
      const files = GAME_FILES[selectedGame]();
      re1FileIndex = s.fileIndex;
      const file = files[re1FileIndex];
      const pages = [];
      if (file.image) pages.push({ type: "image", src: file.image });
      pages.push(...splitTextIntoPages(file.text));
      currentFile = { title: file.title, pages };
    }
    currentPage = s.page || 0;
    hideAll();
    viewer.classList.remove("hidden");
    state = "reading";
    setPageContent();
  } else if (s.screen === "filed") {
    if (s.browsingRE1) {
      showFileList();
    } else {
      hideAll();
      uploadScreen.classList.remove("hidden");
      state = "upload";
    }
  }

  pushingHistory = true;
}

window.addEventListener("popstate", (e) => {
  restoreState(e.state);
});

function hideAll() {
  uploadScreen.classList.add("hidden");
  fileListScreen.classList.add("hidden");
  titleScreen.classList.add("hidden");
  viewer.classList.add("hidden");
  filedScreen.classList.add("hidden");
}

function showTitle() {
  hideAll();
  titleText.textContent = currentFile.title.toUpperCase();
  titleScreen.classList.remove("hidden");
  state = "title";
  pushHistory({ screen: "title", browsingRE1, game: selectedGame, fileIndex: re1FileIndex });
}

function openFile() {
  hideAll();
  viewer.classList.remove("hidden");
  currentPage = 0;
  state = "reading";
  playPageSound();
  renderPage();
  pushHistory({ screen: "reading", browsingRE1, game: selectedGame, fileIndex: re1FileIndex, page: 0 });
}

let isAnimating = false;

function setPageContent() {
  const page = currentFile.pages[currentPage];
  const content = document.querySelector(".file-content");

  if (page.type === "image") {
    content.classList.add("image-page");
    pageText.style.display = "none";
    let img = content.querySelector(".page-image");
    if (!img) {
      img = document.createElement("img");
      img.className = "page-image";
      content.appendChild(img);
    }
    img.src = page.src;
    img.style.display = "";
  } else {
    content.classList.remove("image-page");
    pageText.style.display = "";
    const img = content.querySelector(".page-image");
    if (img) img.style.display = "none";
    pageText.textContent = page.content;
  }

  if (currentPage === 0) {
    prevBtn.classList.add("hidden");
  } else {
    prevBtn.classList.remove("hidden");
  }

  const isLastPage = currentPage === currentFile.pages.length - 1;
  exitLabel.classList.toggle("visible", isLastPage);
}

function renderPage(direction) {
  const content = document.querySelector(".file-content");

  if (!direction) {
    setPageContent();
    return;
  }

  isAnimating = true;
  prevBtn.style.visibility = "hidden";
  nextBtn.style.visibility = "hidden";

  const outClass = direction === "next" ? "slide-out-left" : "slide-out-right";
  const inClass = direction === "next" ? "slide-in-left" : "slide-in-right";

  content.classList.add(outClass);

  content.addEventListener("animationend", function onOut() {
    content.removeEventListener("animationend", onOut);
    content.classList.remove(outClass);

    setPageContent();

    content.classList.add(inClass);
    content.addEventListener("animationend", function onIn() {
      content.removeEventListener("animationend", onIn);
      content.classList.remove(inClass);
      isAnimating = false;
      prevBtn.style.visibility = "";
      nextBtn.style.visibility = "";
    });
  });
}

function playPageSound() {
  playSound("pageTurn");
}

function nextPage() {
  if (isAnimating) return;
  if (currentPage < currentFile.pages.length - 1) {
    currentPage++;
    playPageSound();
    renderPage("next");
  }
}

function prevPage() {
  if (isAnimating) return;
  if (currentPage > 0) {
    currentPage--;
    playPageSound();
    renderPage("prev");
  }
}

function typeText(element, text, speed, callback) {
  element.textContent = "";
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text[i];
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  type();
}

function exitFile() {
  if (state !== "reading") return;
  state = "filed";
  pushHistory({ screen: "filed", browsingRE1 });
  playSound("exit");
  viewer.classList.add("hidden");
  filedScreen.classList.remove("hidden");

  const title = currentFile.title.toUpperCase();
  const subtitle = "has been filed.";
  const arrowEl = document.getElementById("filed-arrow");
  arrowEl.style.display = "none";
  filedSubtitle.childNodes.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) n.remove();
  });

  typeText(filedTitle, title, 60, () => {
    const textNode = document.createTextNode("");
    filedSubtitle.insertBefore(textNode, arrowEl);
    let i = 0;
    function typeSubtitle() {
      if (i < subtitle.length) {
        textNode.textContent += subtitle[i];
        i++;
        setTimeout(typeSubtitle, 60);
      } else {
        arrowEl.style.display = "";
      }
    }
    typeSubtitle();
  });
}

function dismissFiled() {
  if (state !== "filed") return;
  if (browsingRE1) {
    showFileList();
  } else {
    hideAll();
    uploadScreen.classList.remove("hidden");
    state = "upload";
    pushHistory({ screen: "upload" });
  }
}

filedScreen.addEventListener("click", dismissFiled);

titleNextBtn.addEventListener("click", openFile);
prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", () => {
  if (currentPage < currentFile.pages.length - 1) {
    nextPage();
  } else {
    exitFile();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (state === "title") {
      openFile();
    } else if (state === "reading") {
      if (currentPage < currentFile.pages.length - 1) {
        nextPage();
      } else {
        exitFile();
      }
    } else if (state === "filed") {
      dismissFiled();
    }
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (state === "reading") prevPage();
  } else if (e.key === "Escape") {
    if (state === "reading") exitFile();
    else if (state === "filed") dismissFiled();
    else if (state === "filelist") {
      hideAll();
      uploadScreen.classList.remove("hidden");
      state = "upload";
      pushHistory({ screen: "upload" });
    }
  }
});

// Upload handlers
function handleFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    loadFile(file.name, e.target.result);
  };
  reader.readAsText(file);
}

fileInput.addEventListener("change", (e) => {
  handleFile(e.target.files[0]);
});

uploadScreen.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadScreen.classList.add("dragover");
});

uploadScreen.addEventListener("dragleave", () => {
  uploadScreen.classList.remove("dragover");
});

uploadScreen.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadScreen.classList.remove("dragover");
  handleFile(e.dataTransfer.files[0]);
});

// Back button on file list
document.getElementById("back-btn").addEventListener("click", () => {
  hideAll();
  uploadScreen.classList.remove("hidden");
  state = "upload";
  pushHistory({ screen: "upload" });
});

// Game files button
re1FilesLink.addEventListener("click", () => {
  const gameSelect = document.getElementById("game-select");
  selectedGame = gameSelect.value;
  if (selectedGame && GAME_FILES[selectedGame]) {
    showFileList();
  }
});

// Swipe navigation
let touchStartX = null;
let touchStartY = null;
const SWIPE_THRESHOLD = 50;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  touchStartX = null;
  touchStartY = null;

  if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;

  if (dx < 0) {
    // Swipe left → next
    if (state === "title") {
      openFile();
    } else if (state === "reading") {
      if (currentPage < currentFile.pages.length - 1) {
        nextPage();
      } else {
        exitFile();
      }
    } else if (state === "filed") {
      dismissFiled();
    }
  } else {
    // Swipe right → prev
    if (state === "reading") prevPage();
  }
});

// Set initial history state
history.replaceState({ screen: "upload" }, "");
