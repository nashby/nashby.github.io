---
layout: post
title: Rails API and Facebook login (featuring Doorkeeper).
---

When it comes to add Facebook login to Rails application there're tons of guides and examples how to do it using Devise and Omniauth gems. That works well when you need to make it work with "classic" Rails application. But if you have Rails API application that powers your iOS/Android application it's a bit different story.

Note: This post is only about backend part and it assumes that you know how to obtain Facebook access token (it's described in [this doc](https://developers.facebook.com/docs/facebook-login/ios/)).

So that's what we have:

- Rails API application with protected endpoints that are accessible only by authenticated users (authenticated through Facebook).
- iOS/Android client that does Facebook authentication and provides us users's Facebook access token.

For user authentication we will use OAuth 2 protocol. We gonna use [Doorkeeper](https://github.com/doorkeeper-gem/doorkeeper) gem to add OAuth 2 authorization support for our Rails API. By default Doorkeeper supports all common grants like `Authorization code`, `Client credentials`, `Implicit` grant, etc. But it doesn't work for us. All that we going to get from mobile clients is users's access token from Facebook. Here comes the [`Assertion` grant](http://tools.ietf.org/html/rfc7521). Since it's not supported by Doorkeeper by default we need to use this [`doorkeeper-grants_assertion`](https://github.com/doorkeeper-gem/doorkeeper-grants_assertion) extension. That's how the flow works:

     Relying
     Party                     Client                   Token Service
       |                          |                         |
       |                          |  1) Request Assertion   |
       |                          |------------------------>|
       |                          |                         |
       |                          |  2) Assertion           |
       |                          |<------------------------|
       |    3) Assertion          |                         |
       |<-------------------------|                         |
       |                          |                         |
       |    4) OK or Failure      |                         |
       |------------------------->|                         |
       |                          |                         |
       |                          |                         |

where Relying Party is our Rails API, Client is iOS/Android app, Token Service is Facebook.

Let's configure Doorkeeper to support that flow. That's how your config/initializers/doorkeeper.rb might look:

```ruby
Doorkeeper.configure do
  # Getting resource owner (User) from the Facebook's access token.
  resource_owner_from_assertion do
    Authentication::Facebook.new(params[:assertion]).user!
  end

  # Allows only assertion flow.
  grant_flows %w(assertion)
end
```

Yeah, that simple. `Authentication::Facebook` class is just a simple service that fetches the user information using Facebook's access token and tries to create a new user or return existing one based on user's Facebook id. It might look like this:

```ruby
require 'net/http'

module Authentication
  class Facebook
    FACEBOOK_URL = 'https://graph.facebook.com/v3.0/'
    FACEBOOK_USER_FIELDS = 'id,name,first_name,last_name'

    def initialize(access_token)
      @access_token = access_token
    end

    def user!
      return if user_data.blank? || facebook_id.blank?

      User.find_by(facebook_id: facebook_id) || create_user!
    end

    private

    def create_user!
      User.create!(
        facebook_id: facebook_id,
        first_name: first_name,
        last_name: last_name
      )
    end

    def user_data
      @user_data ||= begin
        response = Net::HTTP.get_response(request_uri)
        JSON.parse(response.body)
      end
    end

    def facebook_id
      user_data['id']
    end

    def first_name
      user_data['first_name']
    end

    def last_name
      user_data['last_name']
    end

    def request_uri
      URI.parse("#{FACEBOOK_URL}me?access_token=#{@access_token}&fields=#{FACEBOOK_USER_FIELDS}")
    end
  end
end
```

That's basically it. Finally, you can test that everything works by making a request to our Rails API:

```
curl -X POST \
  http://localhost:3000/oauth/token \
  -d 'client_id=OAUTH_CLIENT_ID&grant_type=assertion&assertion=YOUR_FACEBOOK_ACCESS_TOKEN'
```

where `OAUTH_CLIENT_ID` is your id of Doorkeeper's OAuth Application (you can read more about it [here](https://github.com/doorkeeper-gem/doorkeeper#applications-list)), `YOUR_FACEBOOK_ACCESS_TOKEN` is your Facebook access token (just to test, you can generate it in [Facebook's Graph API Explorer](https://developers.facebook.com/tools/explorer/)). After running that request you'll get something like:

```
{"access_token":"e457964f1a006c75b3eeee168460547d6b6ffd5983dc284571832fed3a5b4ec9","token_type":"bearer","expires_in":86400,"refresh_token":"ad91f7b6c0a85f55c1d33c187a3ad0f4e79565a8d2074e38ba9f298357e459b2","created_at":1528458832}
```

It works! Here's the `access_token` you can use to do [authorized requests](https://github.com/doorkeeper-gem/doorkeeper#protecting-resources-with-oauth-aka-your-api-endpoint) to your endpoints!
