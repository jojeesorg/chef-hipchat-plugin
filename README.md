# chef-hipchat-plugin

A plugin for Hipchat to get information from the Chef server. You will need to
Deploy/Install this plugin, then configure it. Both are explained in this README.md.

## Deployment or Installation

### Heroku

#### Heroku Button

1. First click the following button to provision the instance: [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/chef-partners/chef-hipchat-plugin/blob/master)
1. After provisioning is done, set up [heroku toolbelt][heroku_toolbelt]
1. Login to the heroku cli: `heroku login`
1. Clone the git repo that is under the settings, `cd` into that directory.
1. Take note of the heroku application URL, edit the `config.json` line 96, with that URL.
1. Added the change to the `master` branch: `git commit -am 'added new baseURL'`
1. Push to heroku: `git push heroku master`
1. Refresh your instance, you should see a JSON blob.
1. Continue to the Configuration section.

#### Heroku by hand

- If you would like to spin this up via [heroku][heroku] by hand, click here: [docs/deployment/heroku.md](docs/deployment/heroku.md)

### Local instance

- If you would like to run this behind your own firewall, you should use the [chef-hipchat-plugin-cookbook][chef-hipchat-cookbook]. There are a few things you need to do to set it up.

1. Provision a Ubuntu 14.04 machine
1. Install [chef-client][chef_install] on the machine
1. Either upload the [chef-hipchat-plugin-cookbook][chef-hipchat-cookbook] to your chef server, or run the `chef-solo` command that it suggests.
1. Verify that you can connect to that machine, and see the `http://<machine>:3000/atlassian-connect.json`
1. If your hipchat instance can reach the machine, and you chef server can reach the machine you've installed the plugin, you should be good to go.
1. Continue to the Configuration section.

## Configuration

1. Go to your location, `https://<url>/atlassian-connect.json` you should see your application ready to install.
1. Inside Hipchat, click on `Configure integrations` on the bottom right.
1. Scroll to the bottom of the page, and click `Install an integration from a descriptor URL`.
1. Paste your heroku URL with `atlassian-connect.json` on the end to the `Descriptor URL box`, click Install.
1. Select the Room you'd like to install to, click Continue.
1. Verify this is what you'd like to install, click Approve.
1. Configure your Plugin via the required fields, congrats, you've installed the Plugin!

## Commands

- `/chef environment NAME` - Returns what is cookbooks are active in this environment
- `/chef health` - Returns the health information of your chef server
- `/chef license` - Returns the license usage for your chef server
- `/chef nodes` - Lists out all the machine that your chef server knows about
- `/chef node-status FQDN` - Returns information since the last converge of machine

## License and Authors

Author:: Chef Partner Engineering (<partnereng@chef.io>)

Copyright:: Copyright (c) 2016 Chef Software, Inc.

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
[chef-hipchat-cookbook]: https://github.com/chef-partners/chef-hipchat-plugin-cookbook
[heroku_toolbelt]: https://toolbelt.heroku.com/
[chef_install]: https://downloads.chef.io/chef-client/
