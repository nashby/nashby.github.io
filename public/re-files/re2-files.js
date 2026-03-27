const RE2_FILES = [
  {
    id: "police-memorandum",
    title: "Police Memorandum",
    image: "images/re2/police-memorandum.png",
    text: `POLICE MEMORANDUM

8/23/1998
This letter is just to inform everyone about the recent movement of equipment that has happened during the precinct's rearrangement.

The safe with four digit lock has been moved from S.T.A.R.S. office on the second floor, to the eastern office on the first floor.

"2236"

Raccoon Police Liaison Dept.`
  },
  {
    id: "chriss-diary",
    title: "Chris's Diary",
    image: "images/re2/chriss-diary.png",
    text: `CHRIS'S DIARY

August 8th
I talked to the chief today once again, but he refused to listen to me. I know for certain that Umbrella conducted T-virus research in that mansion. Anyone infected turns into a zombie. But the entire mansion went up in that explosion; along with any incriminating evidence. Since Umbrella employs so many people in this town, no one is willing to talk about the incident. It looks like I'm running out of options.

August 17th
We've been receiving a lot of local reports about strange monsters appearing at random throughout the city. This must be the work of Umbrella.

August 24th
With the help of Jill and Barry, I finally obtained information vital to this case. Umbrella has begun research on the new G-virus, a variation of the original T-virus. Haven't they done enough damage already?! We talked it over, and have decided to fly to the main Umbrella HQ in Europe. I won't tell my sister about this trip because doing so could put her in danger. Please forgive me Claire.`
  },
  {
    id: "mail-to-chris",
    title: "Mail to Chris",
    image: "images/re2/mail-to-chris.png",
    text: `FEDERAL POLICE DEPT. - INTERNAL INVESTIGATION REPORT

Mr. Chris Redfield
Raccoon City Police Dept.
S.T.A.R.S. division

As per your request, we have conducted our internal investigation and discovered the following information:

1. Regarding the G-virus currently under development by Umbrella Inc.

So far it is unconfirmed that the G-virus even exists. We're continuing with our investigation.

2. Regarding Mr. Brian Irons, Chief of the Raccoon City Police Dept.

Mr. Irons has allegedly received a large sum of funds in bribes from Umbrella Inc. over the last five years. He was apparently involved in the cover up of the mansion lab case along with several other incidents in which Umbrella appears to have direct involvement.

As such, extreme caution is advised when dealing with him.

Jack Hamilton,
Section Chief
Internal Investigations
United States Federal Police Department`
  },
  {
    id: "operation-report-1",
    title: "Operation Report 1",
    image: "images/re2/operation-report-1.png",
    text: `OPERATION REPORT

September 26th

The Raccoon Police Dept. was unexpectedly attacked by zombies. Many have been injured. Even more were killed. During the attack, our communications equipment was destroyed and we no longer have contact with the outside.

We have decided to carry out an operation with the intent of rescuing any possible survivors as well as to prevent this disaster from spreading beyond Raccoon City.

Security of armaments and ammunition.

Chief Irons has voiced concern regarding the issue of terrorism due to a series of recent unresolved incidents. On the very day before the zombies' attack, he made the decision to relocate all weapons to scattered intervals throughout the building as a temporary measure to prevent their possible seizure. Unfortunately, this decision made it extremely difficult for us to locate all ammunition caches.

Recorder: David Ford`
  },
  {
    id: "memo-to-leon",
    title: "Memo to Leon",
    image: "images/re2/memo-to-leon.png",
    text: `MEMO TO LEON

To Leon S. Kennedy,
Congratulations on your assignment to the Raccoon City police department.
We all look forward to having you as part of our team and promise to take good care of you.
Welcome aboard!

From all the guys at the R.P.D.`
  },
  {
    id: "operation-report-2",
    title: "Operation Report 2",
    image: "images/re2/operation-report-2.png",
    text: `OPERATION REPORT 2

September 28th

Early morning 2:30AM. Zombies overran the operation room and another battle broke out. We lost four more people, including David. We're down to four people, including myself. We failed to secure the weapons cache and hope for our survival continues to diminish. We won't last much longer...

We agreed upon a plan to escape through the sewer. There's a path leading from the precinct underground to the sewage disposal plant. We should be able to access the sewers through there.

In order to buy more time, we locked the only door leading to the underground, which is located in the eastern office. We left the key behind in the western office since it's unlikely that any of those creatures have the intelligence to find it and unlock the door.

I pray that this operation report will be helpful to whoever may find it.

Recorder: Elliot Edward`
  },
  {
    id: "chiefs-diary",
    title: "Chief's Diary",
    image: "images/re2/chiefs-diary.png",
    text: `CHIEF'S DIARY

September 23rd
It's all over. Those imbeciles from Umbrella have finally done it... Despite all their promises, they've ruined my town. Soon the streets will be infested with zombies. I'm beginning to think that I may be infected myself. I'll kill everyone in town if this turns out to be true!!!

September 24th
I was successful in spreading confusion among the police as planned. I've made sure that no one from the outside will come to help. With the delays in police actions, no one will have the chance to escape my city alive. I've seen to it personally that all escape routes from inside the precinct have been cut off as well.

September 26th
I've had a change of heart about the remaining survivors inside the precinct. I've decided to hunt them down myself.`
  },
  {
    id: "film-a",
    title: "Film A",
    image: "images/re2/film-a.png",
    text: `FILM A

Code G Human Body Experiment
9/15 15:24`
  },
  {
    id: "film-b",
    title: "Film B",
    image: "images/re2/film-b.png",
    text: `FILM B

Pictured in front of the Arukas tailor.
Regressed into a zombie within two hours.

Subject repeatedly complained about severe agitation of the epidermis in addition to feelings of nausea.
This happened up to the moment he lost conscience.

Picture by R.Lambert`
  },
  {
    id: "film-c",
    title: "Film C",
    image: "images/re2/film-c.png",
    text: `FILM C

Development Code: T-103
Due to accelerated metabolism relative to the earlier 00 series, this subject possesses exemplary regenerative capabilities.

PH-X016 File Data`
  },
  {
    id: "film-d",
    title: "Film D",
    image: "images/re2/film-d.png",
    text: `RECRUIT`
  },
  {
    id: "patrol-report",
    title: "Patrol Report",
    image: "images/re2/patrol-report.png",
    text: `PATROL REPORT

September 20th 9:30 PM
Reporter: Sgt. Neil Carlsen

We received a report of a suspicious individual skulking around the sewers in the outskirts of Raccoon City. I searched the area and located the individual, but he ran away before I was able to question him.

I recovered the following items:

A small amount of C4 plastic explosive.
An electronic detonator.
9x19 parabellum rounds.
Infrared scope (broken).

End of report.`
  },
  {
    id: "secretarys-diary-a",
    title: "Secretary's Diary A",
    image: "images/re2/secretarys-diary-a.png",
    text: `SECRETARY'S DIARY A

April 6th
I accidentally moved one of the stone statues on the second floor when I leaned against it. When the chief found out about it, he was furious. I swear the guy nearly bit my head off, screaming at me never to touch the statue again. If it's so important, then maybe he shouldn't have put it out in the open like that...

April 7th
I heard that all the art pieces from the chief's collection are rare items, literally worth hundreds of thousand of dollars. I don't know which is the bigger mystery: where he finds those tacky things, or where he's getting the money to pay for them.

May 10th
I wasn't surprised to see the chief come in today with yet another large picture frame in his hands. This time it was a really disturbing painting depicting a nude person being hanged. I was appalled by the expression on the chief's face as he leered at that painting.`
  },
  {
    id: "secretarys-diary-b",
    title: "Secretary's Diary B",
    image: "images/re2/secretarys-diary-b.png",
    text: `SECRETARY'S DIARY B

June 8th
As I was straightening up the chief's room, he burst through the door with a furious look on his face. It's only been 2 months since I've started working here, but that was the second time I've seen him like this. The last time was when I bumped into that statue, only this time he looked even more agitated than ever. I seriously thought for a moment that he was going to hurt me.

June 15th
I finally discovered what the chief has been hiding all along... If he finds out that I know, my life will be in serious danger. It's getting late already. I'm just going to have to take this a day at a time...`
  },
  {
    id: "watchmans-diary",
    title: "Watchman's Diary",
    image: "images/re2/watchmans-diary.png",
    text: `WATCHMAN'S DIARY

August 11th
I finally had the chance to see blue skies for the first time in ages, but it did little to lift my spirits. I was reprimanded by the chief for neglecting my duties while I was up on the clock tower.

September 5th
I recently talked to the old man who works in the scrap yard out back. His name is Thomas. He's a quiet man and really seems to enjoy chess. We made plans to play chess tomorrow night.

September 9th
Thomas was a much better player than I had imagined. About the only thing I imagine that could match his skills in chess is his appetite. He sounded fairly healthy, but he didn't look quite right...

September 12th
I was supposed to play another game of chess with Thomas, but we had to cancel because he hasn't been feeling too well. He literally looked like the walking dead. Come to think of it, I haven't been feeling too good myself lately...`
  },
  {
    id: "mail-to-the-chief",
    title: "Mail to the Chief",
    image: "images/re2/mail-to-the-chief.png",
    text: `MAIL TO THE CHIEF

To: Mr. Brian Irons, Chief of the Raccoon City Police Dept.

We have lost the mansion lab facility due to the renegade operative, Albert Wesker. Fortunately, his interference will have no lasting effects upon our continued virus research. Our only present concern is the presence of the remaining S.T.A.R.S. members. If it comes to light that S.T.A.R.S. have any evidence as to the activities of our research, dispose of them in a way that would appear to be purely accidental.

William Birkin`
  },
  {
    id: "sewer-manager-fax",
    title: "Sewer Manager Fax",
    image: "images/re2/sewer-manager-fax.png",
    text: `SEWER MANAGER FAX

User List of the Connecting Facility

On the first and third Wednesdays of the month, Angelica Margaret, chief of maintenance, will make use of the facilities. Be sure to reduce the moisture levels in the facility by activating the fan.

On the 28th of every month, the chemical transporter Don Weller will use the facility. The chemicals he will be transporting are extremely volatile.

On the 6th and 16th of every month, police chief Brian Irons will visit the facility to attend the regular meeting that take place in the lab.

On the fourth Friday of every other month, William Birkin will use the facility to conduct a training seminar. As the probability of an attack upon William Birkin will be high, take every measure conceivable to guard his life.

Charles Coleman
Secretary Chief
Umbrella Headquarters`
  },
  {
    id: "sewer-manager-diary",
    title: "Sewer Manager Diary",
    image: "images/re2/sewer-manager-diary.png",
    text: `SEWER MANAGER DIARY

June 28th
It's been a while, but I saw Don today and we talked after completing our work. He told me he had been sick in bed until yesterday. He was sweating like a horse and kept scratching his body while we were talking. What's wrong with him anyway?

July 7th
Chief Irons has been visiting the lab quite often lately. I don't know what he's doing over there but he always looks grim. My guess is that it's because of Dr. Birkin's impossible requests.

August 16th
Chief Irons came in late today, looking grimmer than his usual self. I tried to joke with him to cheer him up but he wasn't amused. He pulled his gun and threatened to shoot me!

August 21st
William informed me that the police and media have begun their investigation on Umbrella's affairs. He asked me to suspend all Umbrella sewer facility operations until the investigation has concluded.`
  },
  {
    id: "lab-security-manual",
    title: "Lab Security Manual",
    image: "images/re2/lab-security-manual.png",
    text: `LABORATORY SECURITY MANUAL

Security measures in case of an emergency

In the instance of an uncontainable biohazardous breakout, all security measures will be directed toward the underground transport facility.

In the instance that any abnormalities are detected among cargo in transit, all materials will automatically be transported to the designated high-speed train, isolated and disposed of immediately.

In the instance of a Class 1 emergency, the entire train will be purged and disposed of without delay.

In the instance that the lab itself becomes contaminated, the northern most route will be designated as the emergency escape route, securing passage to the relay point outside the city limits.`
  },
  {
    id: "p-epsilon-report",
    title: "P-Epsilon Report",
    image: "images/re2/p-epsilon-report.png",
    text: `INVESTIGATIVE REPORT ON P-EPSILON GAS

This report demands immediate attention.

The P-epsilon gas has been proven capable of incapacitating all known B.O.W.s (Bio Organic Weapon). As such, it has been designated for emergency usage in the event of a B.O.W. escape.

The P-epsilon gas has proven to weaken the B.O.W.s' cellular functions. However, prolonged or repeated exposures will result in the creation of adaptive antibodies to the agent. Furthermore, some species have been observed to absorb the P-epsilon gas as a source of nutrition.

Use of P-epsilon gas should be severely limited to extreme cases only.

2nd R&D Room / Security Team`
  },
  {
    id: "user-registration",
    title: "User Registration",
    image: "images/re2/user-registration.png",
    text: `USER REGISTRATION

Temporary User Registration for the Culture Experiment Room.

User Name: "GUEST"
Password: None

Valid for 24 hours.`
  },
  {
    id: "vaccine-synthesis",
    title: "Vaccine Synthesis",
    image: "images/re2/vaccine-synthesis.png",
    text: `INSTRUCTIONS FOR THE SYNTHESIS OF THE G-VIRUS ANTIGEN

G-VACCINE. CODE NAMED "DEVIL."

Any beings infected by the G-virus will reproduce through the impregnation of an embryo within another living being. Unless rejected by the host, the embryo will undertake a process of gradual cellular invasion, infecting the host's cells on a molecular level as it rewrites their DNA.

The vaccine creation requires the base vaccine. This can be arranged by the activator VAM. First set the empty cartridge to the VAM and activate it. Then confirm the green light is on, remove the cartridge and proceed to the next step.

Once the base vaccine has been prepared, set it in the vaccine synthesis machine located in the P-4 level experiment room. Synthesis will be complete within approximately 10 seconds.

Careful handling is required for the proper results.`
  },
];
