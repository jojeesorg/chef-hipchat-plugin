# chef-hipchat-plugin

A plugin for HipChat to get information from the Chef server.

## Deployment or Installation

### Heroku

- If you would like to spin this up via [heroku][heroku] by hand, click here: [docs/deployment/heroku.md](docs/deployment/heroku.md)


### Local instance

## Commands

- `/chef environment NAME` - Returns what is cookbooks are active in this environment
- `/chef health` - Returns the health information of your chef server
- `/chef license` - Returns the license usage for your chef server
- `/chef nodes` - Lists out all the machine that your chef server knows about
- `/chef node-status FQDN` - Returns information since the last converge of machine

## License and Authors

Author:: Chef Partner Engineering (<partnereng@chef.io>)

Copyright:: Copyright (c) 2015 Chef Software, Inc.

License:: Apache License, Version 2.0

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the License at

```
http://www.apache.org/licenses/LICENSE-2.0
```

Unless required by applicable law or agreed to in writing, software distributed under the
License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
either express or implied. See the License for the specific language governing permissions
and limitations under the License.

## Contributing

1. Fork it ( https://github.com/chef-partners/chef-hipchat-plugin/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

[heroku]: http://heroku.com
