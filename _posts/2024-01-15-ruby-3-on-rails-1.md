---
layout: post
title: Ruby (3.3) on Rails (1.0).
---


`Rails 8.0` has recently branched out on Github, and I found myself curious about the feasibility of running `Rails 1.0` on the latest Ruby version. While I was pretty sure it wouldn't work right off the bat, I wondered: how many modifications would be necessary to at least reach the iconic "Welcome aboard! You’re riding the Rails!" screen?

So, let's dive in. My starting point was this Gemfile:

```ruby
source "https://rubygems.org"
gem "rails", "1.0.0"
```

Since I knew that it would be required to make some changes to Rails gems I install it with `bundle install --local`. This would allow for easier modifications later on. My first attempt was running `bundle exec rails --help`:

```
/activesupport-1.2.5/lib/active_support/inflector.rb:157: syntax error, unexpected ':', expecting `then' or ',' or ';' or '\n' (SyntaxError)
        when 1: "#{number}st"
              ^
```

Indeed, older Ruby versions allowed the use of a colon in place of `then` in case/when expressions. This syntax is no longer supported, so I updated it across the codebase to match the current Ruby syntax.

Ok let's try again with `bundle exec rails --help`:

```
cannot load such file -- parsedate (LoadError)
```

Oh yeah, `parsedate` lib that was shipped with `Ruby 1.8` is not longer there. It was used to parse date strings, like so:

```ruby
ParseDate.parsedate "Tuesday, July 5th, 2007, 18:35:20 UTC"
# => [2007, 7, 5, 18, 35, 20, "UTC", 2]
```

Not sure why it was returning an array but ok. Now I can replace it with `DateTime.parse` that returns `DateTime` object. So I've fixed that and tried to run it again. Ugh, another error:

```
rails-1.0.0/lib/rails_generator/options.rb:124: syntax error, unexpected '[', expecting '|' (SyntaxError)
...make any changes.') { |options[:pretend]| }
```

That's some weird syntax. Turns out you could assign something to a hash right inside the block variable thing:

```ruby
opt.on('-p', '--pretend', 'Run but do not make any changes.') { |options[:pretend]| }
```

meaning that whatever you pass as `-p` option will end up being assigned to `options[:pretend]`. Basically it equals to

```ruby
opt.on('-p', '--pretend', 'Run but do not make any changes.') { |o| options[:pretend] = o }
```

Alrighty then. Rerun `bundle exec rails --help`:

```
no implicit conversion of Enumerator into Array
```

And it's without any stacktrace. Great. Looks like something catches all the errors and just prints them. After
some investigation I've found this code:

```ruby
def cache
  @cache ||= sources.inject([]) { |cache, source| cache + source.map }
end
```

In Ruby 1.8 `[].map` would return an array but now it returns `Enumerator` object and you can concat an `Array` with
`Enumerator` hence the error:

```
irb(main):001> [] + [].map
(irb):1:in `+': no implicit conversion of Enumerator into Array (TypeError)
```

It's an easy fix though. Let's just call `.to_a` on the `source`:

```
def cache
  @cache ||= sources.inject([]) { |cache, source| cache + source.to_a }
end
```

Are we getting there?

```
bundle exec rails --help

`load': cannot load such file -- config.rb (LoadError)
```

The code in question is

```ruby
require 'rbconfig'

DEFAULT_SHEBANG = File.join(Config::CONFIG['bindir'],
                            Config::CONFIG['ruby_install_name'])
```

Makes sense, in old Ruby `RbConfig` could be referenced with `Config` constant and now it's only `RbConfig`. Fixed. Does it work now?

```
bundle exec rails --help

Usage: /vendor/bundle/ruby/3.3.0/bin/rails /path/to/your/app [options]
```

Great Scott! It works! Let's try to generate a new app:

```
bundle exec rails blog

undefined method `exists?' for class File
```

Dammit, `File.exists?`/`FileTest.exists?` were removed in Ruby 1.9. Let's replace it with `File.exist?`/`FileTest.exist?` and try again:

```
bundle exec rails blog
      create
      create  app/controllers
      create  app/helpers
      create  app/models
      create  app/views/layouts
      create  config/environments
      create  components
      create  db
      create  doc
      create  lib
      create  lib/tasks
      create  log
      create  public/images
      create  public/javascripts
      create  public/stylesheets
      create  script/performance
      create  script/process
      create  test/fixtures
      create  test/functional
      create  test/mocks/development
      create  test/mocks/test
      create  test/unit
      create  vendor
      create  vendor/plugins
      create  Rakefile
      create  README
      create  app/controllers/application.rb
Cannot create Binding object for non-Ruby caller
```

Success! Is it though? It has generated an app but all the files are empty. And if you have a sharp eye you'll have noticed this error:

```
Cannot create Binding object for non-Ruby caller
```

Again, no stacktracks, just some plain error. It took me some time to locate that line of code that was failing with such error but here it is:

```ruby
file(relative_source, relative_destination, template_options) do |file|
  # Evaluate any assignments in a temporary, throwaway binding.
  vars = template_options[:assigns] || {}
  b = binding
  vars.each { |k,v| eval "#{k} = vars[:#{k}] || vars['#{k}']", b }

  ...
end
```

Believe me, I really tried to figure you what this error was about given that it's obviously a Ruby caller but luck wasn't there for me. Then I tried to replace `binding` with `Kernel.binding`
and it worked... If you know what's going on here please let me know! Maybe Rails were redefining `binding` somewhere?

Alright, let's proceed:

```
bundle exec rails blog
      create
      create  app/controllers
      create  app/helpers
      create  app/models
      ...
```

Finally! The app is generated, files are not empty. We're close, I can smell it! Let's try to start it:

```
 bundle exec ruby script/server -p 3001

`require': cannot load such file -- script/../config/boot (LoadError)
```

Sure, just some random load error. Turns out in Ruby 1.8 you could require a file with relative to current file path and now you can't:

```ruby
# In Ruby 1.8
require File.dirname(__FILE__) + '/../config/boot'

# In Ruby 1.9+
require_relative '../config/boot'
```

With this one fixed we can try it one more time:

```
bundle exec ruby script/server -p 3001

=> Booting WEBrick...

activerecord-1.13.2/lib/active_record/base.rb:708: circular argument reference - table_name (SyntaxError)
```

Ok this one should be trivial. The code in question:

``` ruby
def class_name(table_name = table_name)
  ...
end
```

I'm a bit surprised that this was working in Ruby 1.8. The error is pretty self-explanatory so I just renamed default argument value and continued with my life:

```
bundle exec ruby script/server -p 3001

=> Booting WEBrick...

`load': cannot load such file -- big_decimal.rb (LoadError)
Did you mean?  bigdecimal
```

Right, `bigdecimal` is not required by default now. I'll spare you some time and say that there was the same issue
with `rexml` and `net-smtp` gems (`net-smtp` is not even part of Ruby anymore and I had to add it to the `Gemfile`). So I fixed it and tried again:

```
bundle exec ruby script/server -p 3001

=> Booting WEBrick...
actionmailer-1.1.5/lib/action_mailer/quoting.rb:22: invalid multibyte escape: /[\000-\011\013\014\016-\037\177-\377]/ (SyntaxError)
```

Oh yeah, Ruby 1.9 did a lot of changes to string encoding (you can read more on this [here](http://graysoftinc.com/character-encodings/ruby-19s-string)) and now using raw bytes doesn't work anymore. So I believe we can convert it to `/[\x00-\x11\x13\x14\x16-\x1F\x7F-\xFF]/n` and it's going to work? Well, at least the issue was fixed (yeah, yeah who cares if we've just introduced some vulnerability? I don't):

```
bundle exec ruby script/server -p 3001

=> Booting WEBrick...
`require': cannot load such file -- soap/rpc/driver (LoadError)
```

Oh ffs. It comes from `action_web_service` (god knows what was that back in the days) and lucky us we can remove this Rails component
from our stack with this config:

```
# Skip frameworks you're not going to use
config.frameworks -= [ :action_web_service ]
```

![image](https://github.com/nashby/nashby.github.io/assets/200500/1b81569a-5265-4e37-8d33-596c1c130f4b)

```
bundle exec ruby script/server -p 3001

=> Booting WEBrick...
`require': cannot load such file -- soap/rpc/driver (LoadError)

rails-1.0.0/lib/rails_info.rb:8: syntax error, unexpected ')' (SyntaxError)
        map {|(name, )| name}
```

Cool cool, you could do `.map { |(param1, )| param1 }` in Ruby 1.8 to ommit the second block param. You can actually do it in Ruby 3.3 but you don't need this extra comma:

```ruby
{a: 1, b: 2, c: 3}.map { |a, | a } # => [:a, :b, :c]
# or
{a: 1, b: 2, c: 3}.map { |(a)| a } # => [:a, :b, :c]
# without
{a: 1, b: 2, c: 3}.map { |a| a } # =>[[:a, 1], [:b, 2], [:c, 3]]
```

And one more time...

```
bundle exec ruby script/server -p 3001

=> Booting WEBrick...
[2024-01-15 21:23:25] INFO  WEBrick 1.8.1
[2024-01-15 21:23:25] INFO  ruby 3.3.0 (2023-12-25) [arm64-darwin23]
[2024-01-15 21:23:25] INFO  WEBrick::HTTPServer#start: pid=98161 port=3001
```

Oh my God, we did it!

![Screenshot 2024-01-15 at 21 24 54](https://github.com/nashby/nashby.github.io/assets/200500/3710f177-d1ad-47df-9d0c-b80670bf427e)

If for some reason you want to check the code here it is: https://github.com/nashby/rails-from-the-past

I'm pretty sure there are way more issues to fix to make it work properly but I'm not going to do it.
I'm just happy enough that I've got to the point where I can see this greeting screen! Fin.

And may Ruby be with you!
