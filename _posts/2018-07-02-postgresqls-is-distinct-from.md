---
layout: post
title: PostgreSQL’s IS DISTINCT FROM.
---

Sometimes you need to find records which field is not equal to given value or is `NULL`. And instead of writing something like:

```ruby
User.where('email != ? OR email IS NULL', 'test@example.com')
```

you can use pretty handy PostgreSQL’s `IS DISTINCT FROM` [comparison operator](https://www.postgresql.org/docs/9.1/static/functions-comparison.html):

```ruby
User.where('email IS DISTINCT FROM ?', 'test@example.com')
```
