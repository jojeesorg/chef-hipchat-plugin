# Dev Environment

These are the steps to setup a local dev environment for chef-hipchat-plugin


1. Install redis-server `brew install redis-server`
1. Install ngrok `brew install ngrok`
1. Install vagrant
1. Check out the repo to a location that you can run it
1. Install nodejs and npm
1. Run `npm install` in the repo, to pull down the dependencies
1. Edit the Vagrantfile and change the user from "jj" and password from "123456"
1. Do a `vagrant up` in this `doc/` directory to start up the chef-server
1. Open another tab/terminal run `redis-server`
1. Open another tab/terminal run `ngrok http 3000` take note of the `http://5e6845d7.ngrok.io -> localhost:3000`
1. Open the `config.json` and change the dev environment to whatever that above URL is
1. Open the URL from ngrok, and you should see a json doc, you can now access it from the cloud
1. As soon as the `vagrant up` is done (around 10ish mins) copy that private key. You'll need it.
1. Run `vagrant ssh` to get into the box
1. Check to see if the `default-validator.pem` is in `/home/vagrant`
1. Run `knife configure` fill things out like:

```
vagrant@vagrant:~$ knife configure
WARNING: No knife configuration file found
Where should I put the config file? [/home/vagrant/.chef/knife.rb]
Please enter the chef server URL: [https://vagrant.vm:443]
Please enter an existing username or clientname for the API: [vagrant] jj
Please enter the validation clientname: [chef-validator] default-validator
Please enter the location of the validation key: [/etc/chef-server/chef-validator.pem] /home/vagrant/default-vaildator.pem
Please enter the path to a chef repository (or leave blank):
*****

You must place your client key in:
  /home/vagrant/.chef/jj.pem
Before running commands with Knife!

*****

You must place your validation key in:
  /home/vagrant/default-vaildator.pem
Before generating instance data with Knife!

*****
Configuration file written to /home/vagrant/.chef/knife.rb
```

1. Copy the private key to `/home/vagrant/.chef/jj.pem`
1. Run `knife ssl fetch` because we are doing self signed certs
1. Edit the knife.rb to go to your default org: `chef_server_url          'https://vagrant.vm:443/organizations/default'`
1. Run `knife status` to confirm that you talk to the chef-server, it should return nothing.
1. You can add any machine, but being you just need something, you can add just the chef-server to itself.
1. Copy the `client.rb` and `default-validator.pem` from this directory to `/etc/chef`
1. Run `sudo chef-client` then run `knife status` to verify you've add itself to itself
1. You can now set up the integration to talk to the setup chef server, you'll probably want to use the `jj` and key as your development.
