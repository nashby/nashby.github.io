---
layout: post
title: Fixing Kernel#singleton_method bug in Ruby.
---

Few days ago when I was browsing through StackOverflow I came across [this question](https://stackoverflow.com/questions/49597148/in-activesupportdeprecation-class-singleton-method-seems-to-be-strange) about weird behaviour of `Kernel#singleton_method` such as if you call `Kernel#singleton_methods` method on `ActiveSupport::Deprecation` class you would get you list of singleton methods (no surprise here) but when you try to get that singleton method with `Kernel#singleton_method` Ruby would throw `NameError` error:

```ruby
ActiveSupport::Deprecation.singleton_methods(false) # => [:debug, :initialize, ...]
ActiveSupport::Deprecation.singleton_method(:debug) # => NameError (undefined singleton method `debug' for `ActiveSupport::Deprecation')
```

At first, I thought it's `ActiveSupport` doing something fishy. And while I was looking through `AS` codebase this [answer](https://stackoverflow.com/a/49610959/336626) appeared. [@michaelj](http://twitter.com/michaelj) discovered that it's possible to reproduce this bug without `ActiveSupport` at all. All you needed to do is to prepend any module to a singleton class:

```ruby
module Empty; end

class Foo
  singleton_class.prepend(Empty)

  def self.foo; end
end

Foo.singleton_methods(:false) # => [:foo]
Foo.singleton_method(:foo) # => NameError (undefined singleton method `foo' for `Foo')
```

So it was something wrong with `Module#prepend`.

I started looking for some bugs with `Module#prepend` on [Ruby's bugtracker](https://bugs.ruby-lang.org/). All I could find related was [this](https://bugs.ruby-lang.org/issues/8044) bug with `Object#methods` and `Module#prepend`. So what I needed to do is to check how they fixed it and do something similar with `Kernel#singleton_method`.

**DISCLAIMER: I'm not that good with Ruby internals so next part of the post might have some incorrect statements.**

Main thing I learned from `Object#methods` [fix](https://github.com/ruby/ruby/commit/99126a4c88d3ddb9ea76edf948307c7bfa0fe971) was `RCLASS_ORIGIN` macro. This macro is used to get origin class of the passed class/module. And as I discovered `Module#prepend` makes a copy of a target class internally so if you need to access original one you can use that macro. Honestly, I don't really understand why you can't access singleton method but I got the idea.

That's how `rb_obj_singleton_method` [looked before](https://github.com/ruby/ruby/blob/365338d9d6a3d681b79787c11993fc3bbccab05c/proc.c#L1771) the fix:

```c
rb_obj_singleton_method(VALUE obj, VALUE vid)
{
  ...
  if (!id) {
    if (!NIL_P(klass = rb_singleton_class_get(obj))
  ...
```

as you can see the `klass` was retrieved by `rb_singleton_class_get` function which returns class's copy if it was already prepended with some module. That means all I had to do is to apply `RCLASS_ORIGIN` on that class. And it did the trick. You can find the whole patch in [this issue](https://bugs.ruby-lang.org/issues/14658).

And may Ruby be with you.
