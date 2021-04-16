---
layout: post
title: Ruby 3.0 changes how methods of subsclassed core classes work.
---

First of all you most likely [shouldn’t inherit from Ruby’s core classes](https://avdi.codes/why-you-shouldnt-inherit-from-rubys-core-classes-and-what-to-do-instead/). But if you still want to do it, it's better to know what was changed in Ruby 3.0.

Before Ruby 3.0 return values of core classes methods like e.g String#upcase or Array#rotate were inconsistent. Here what I mean:

```ruby
class Foo < Array
end

foo = Foo.new
foo.rotate.class # => Array
```

```ruby
class Bar < String
end

bar = Bar.new
bar.upcase.class # => Bar
```

As you can see in the first example `Foo#rotate` returns the instance of Array class and `Bar#upcase` returns the instance of Bar class. Personally, I'd prefer if Ruby would always return an instance of subclass but if you check [this](https://bugs.ruby-lang.org/issues/6087) discussion it becomes pretty clear that it's hard to make it work properly for all cases and it's better to always return an instance of the original class.

So that's what was done in Ruby 3.0! You can check these Pull Requests [here](https://github.com/ruby/ruby/pull/3701) and [here](https://github.com/ruby/ruby/pull/3690) with the changes. Now all `String` and `Array` methods always return instances of the original class, not the subclass.

The way I learned about this change was failing [Enumerize](https://github.com/brainspec/enumerize) build. Enumerize is a gem for enumerated attributes with I18n and ActiveRecord/Mongoid/MongoMapper/Sequel support. And a class that powers enumerated value is [a subclass of String core class](https://github.com/brainspec/enumerize/blob/abb2290a8666d085385915af2b3dcece3aebb4e8/lib/enumerize/value.rb#L7). So before you could just write something like

```ruby
user.role.upcase # => 'ADMIN'
```

where the role is an enumerated field, you would get upcased value of `Enumerize::Value` instance but with Ruby 3.0 changes it becomes `String` instance. It means you can't use any `Enumerize` methods on that value anymore. It's not a big deal in terms of `Enumerize` usage since in most cases you don't apply any String's methods on it but would be good to make it not depend on the fact that `Enumerize::Value` is a subclass of Ruby's `String`.
