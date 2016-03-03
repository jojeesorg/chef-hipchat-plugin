# Heroku

These are the steps to install this `nodejs` application by hand.

1. Sign up for heroku ;)
1. Log into the dashboard
1. Install the [heroku toolbelt][heroku_toolbelt]
1. Clone the [chef-hipchat-plugin][chef-hipchat-plugin] if you havent, `cd` into that directory.
1. Login to the heroku cli: `heroku login`
1. Create the heroku instance: `heroku create`
1. Take note of the application URL, edit the `config.json` line 96, with that URL.
1. Commit this change to `master`: `git commit -ma 'edited heroku location'`
1. Verify that a new remote was created called `heroku`: `git remote -v`
1. Push the code to heroku's remote: `git push heroku master`
1. After push is complete, make sure at least one web instance is running: `heroku ps:scale web=1`
1. You can run `heroku open` but you should get an error, due to the lack of redis.
1. Run `heroku logs` to verify the error, `Redis connection to 127.0.0.1:6379 failed`
1. Create a [Procfile][procfile] if you haven't already, with the line: `web: node app.js`
1. Confirm you have all the dependencies, via `npm install`
1. Verify that your app runs locally: `heroku local web`
1. Provision Redis via an addon: heroku addons: `heroku addons:create heroku-redis:hobby-dev`
1. Verify the application is running correctly: `heroku logs`
1. Go to your location, `https://<URL>.herokuapp.com/atlassian-connect.json` you should see your application ready to install.
1. Inside Hipchat, click on `Configure integrations` on the bottom right.
1. Scroll to the bottom of the page, and click `Install an integration from a descriptor URL`.
1. Paste your heroku URL with `atlassian-connect.json` on the end to the `Descriptor URL box`, click Install.
1. Select the Room you'd like to install to, click Continue.
1. Verify this is what you'd like to install, click Approve.
1. Configure your Plugin via the required fields, congrats, you've installed the Plugin!


[heroku_toolbelt]: https://toolbelt.heroku.com/
[chef-hipchat-plugin]: https://github.com/chef-partners/chef-hipchat-plugin
[procfile]: https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-a-procfile
