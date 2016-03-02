var http = require('request');
var cors = require('cors');
var uuid = require('uuid');
var moment = require('moment');

// This is the heart of your HipChat Connect add-on. For more information,
// take a look at https://developer.atlassian.com/hipchat/guide
module.exports = function (app, addon) {
    var hipchat = require('../lib/hipchat')(addon);

    // simple healthcheck
    app.get('/healthcheck', function (req, res) {
        res.send('OK');
    });

    // Root route. This route will serve the `addon.json` unless a homepage URL is
    // specified in `addon.json`.
    app.get('/',
            function(req, res) {
                // Use content-type negotiation to choose the best way to respond
                res.format({
                    // If the request content-type is text-html, it will decide which to serve up
                    'text/html': function () {
                        res.redirect(addon.descriptor.links.homepage);
                    },
                    // This logic is here to make sure that the `addon.json` is always
                    // served up when requested by the host
                    'application/json': function () {
                        res.redirect('/atlassian-connect.json');
                    }
                });
            }
           );

    // This is an example route that's used by the default for the configuration page
    // https://developer.atlassian.com/hipchat/guide/hipchat-ui-extensions/configuration-page
    app.get('/config',
            // Authenticates the request using the JWT token in the request
            addon.authenticate(),
            function(req, res) {
                // The `addon.authenticate()` middleware populates the following:
                // * req.clientInfo: useful information about the add-on client such as the
                //   clientKey, oauth info, and HipChat account info
                // * req.context: contains the context data accompanying the request like
                //   the roomId
                var config = {}
                addon.settings.get('configData',req.clientInfo.clientKey).then(function(data){
                    config.identity = req.identity;
                    if (data) {
                        config.username = data.username;
                        config.privateKey = data.privateKey;
                        config.url = data.url;
                        config.ssl = data.ssl;
                    } else {
                        config.username = '';
                        config.privateKey = '';
                        config.url = '';
                        config.ssl = '1';
                    }

                    res.render('config', config);
                    console.log(JSON.stringify(config));
                }).catch
                    (console.log)}
           );

    app.post('/config',
             addon.authenticate(),
             function(req, res) {
                 console.log(req.body);
                 var validData = {};
                 validData.username = req.body.username;
                 validData.privateKey = req.body.privateKey;
                 validData.url = req.body.url;
                 validData.ssl = req.body.ssl;
                 addon.settings.set('configData', validData, req.clientInfo.clientKey);
                 res.redirect('/config?signed_request=' + res.locals.signed_request);
             }
            );

    // This is an example glance that shows in the sidebar
    // https://developer.atlassian.com/hipchat/guide/hipchat-ui-extensions/glances
    app.get('/glance',
            cors(),
            addon.authenticate(),
            function(req, res) {
                res.json({
                    "label": {
                        "type": "html",
                        "value": "Chef"
                    }
                });
            }
           );

    // This is an example end-point that you can POST to to update the glance info
    // Room update API: https://www.hipchat.com/docs/apiv2/method/room_addon_ui_update
    // Group update API: https://www.hipchat.com/docs/apiv2/method/addon_ui_update
    // User update API: https://www.hipchat.com/docs/apiv2/method/user_addon_ui_update
    app.post('/update_glance',
             cors(),
             addon.authenticate(),
             function(req, res){
                 res.json({
                     "label": {
                         "type": "html",
                         "value": "Hello World!"
                     },
                     "status": {
                         "type": "lozenge",
                         "value": {
                             "label": "All good",
                             "type": "success"
                         }
                     }
                 });
             }
            );

    app.post('/webhook',
             addon.authenticate(),
             function (req, res) {
                 var ChefApi = require("chef-api");
                 var chef = new ChefApi();

                 var epochTimeMilli = (new Date).getTime();
                 var seconds = epochTimeMilli / 1000;

                 addon.settings.get('configData',req.clientInfo.clientKey).then(function(data){
                     process.env.NODE_TLS_REJECT_UNAUTHORIZED = data.ssl;
                     var options = {
                         user_name: data.username,
                         key: data.privateKey,
                         url: data.url
                     }

                     chef.config(options);

                     var command = req.body.item.message.message;
                     command = parseCommand(command);

                     // needs fqdn to work
                     if (command.command.trim().toLowerCase() === 'status' && command.optionList != null && command.optionList.length > 0) {

                         chef.getNode(command.optionList[0], function(err, res) {
                             if(err) {
                                 var options = {
                                     options: {
                                         color: "red"
                                     }
                                 };
                                 hipchat.sendMessage(req.clientInfo, req.context.item.room.id, '<strong>'+err.toString()+'</strong>', options)
                                 .then(function (data) {
                                     res.send(200);
                                 });
                                 return;
                             };

                             var timeSinceConverge = (seconds - res.automatic.ohai_time);
                             var duration = moment.duration(Math.floor(timeSinceConverge), 'seconds');

                             var jsonResult = {
                                 timeSinceConverge: duration.humanize(),
                                 fqdn: res.automatic.fqdn
                             };

                             var timeString = JSON.stringify(jsonResult.timeSinceConverge, null, 2).replace(/"/g,'');
                             var fqdnString = JSON.stringify(jsonResult.fqdn, null, 2).replace(/"/g,'');

                             hipchat.sendMessage(req.clientInfo, req.context.item.room.id, '<strong>'+fqdnString+'</strong>' + ' successfully converged ' + timeString + ' ago.', options)
                                 .then(function (data) {
                                     res.send(200);
                                 });
                             });

                     } else if (command.optionList == 'unikitty') {

                         unikitty = "<img src='http://pages.chef.io/rs/255-VFB-268/images/unikitten-plain.jpg'><br>"

                         hipchat.sendMessage(req.clientInfo, req.context.item.room.id, unikitty, options)
                             .then(function (data) {
                                 res.send(200);
                             });

                     } else if (command.optionList == 'nodes') {

                         chef.getNodes(function(err, res) {
                             if(err) {
                                 var options = {
                                     options: {
                                         color: "red"
                                     }
                                 };
                                 hipchat.sendMessage(req.clientInfo, req.context.item.room.id, '<strong>'+err.toString()+'</strong>', options)
                                 .then(function (data) {
                                     res.send(200);
                                 });
                                 return;
                             };

                             var stringResult = '';

                             Object.keys(res).forEach(function (key) {
                                 stringResult += key +  '<br>';
                             });

                             hipchat.sendMessage(req.clientInfo, req.context.item.room.id, stringResult, options)
                                 .then(function (data) {
                                     res.send(200);
                                 });
                         });

                     } else if (command.optionList == 'health') {

                         chef.getStatus(function(err, res) {
                             if(err) {
                                 var options = {
                                     options: {
                                         color: "red"
                                     }
                                 };
                                 hipchat.sendMessage(req.clientInfo, req.context.item.room.id, 'Sorry, you need to have the <strong>pivotal</strong> key to get this data. '+err.toString()+'</strong>', options)
                                     .then(function (data) {
                                         res.send(200);
                                     });
                                 return;
                             };

                             hipchat.sendMessage(req.clientInfo, req.context.item.room.id, res, options)
                                 .then(function (data) {
                                     res.send(200);
                                 });
                         });
                     } else if (command.optionList == 'smalltown') {

                         youtube = '<a href="https://www.youtube.com/watch?v=1k8craCGpgs">https://www.youtube.com/watch?v=1k8craCGpgs</a>';

                         hipchat.sendMessage(req.clientInfo, req.context.item.room.id, youtube, options)
                             .then(function (data) {
                                 res.send(200);
                             });

                     } else if (command.command.trim().toLowerCase() === 'environment' && command.optionList != null && command.optionList.length > 0) {
                         chef.getEnvironmentCookbooks(command.optionList[0], function(err, res) {
                             if(err) {
                                 var options = {
                                     options: {
                                         color: "red"
                                     }
                                 };
                                 hipchat.sendMessage(req.clientInfo, req.context.item.room.id, '<strong>'+err.toString()+'</strong>', options)
                                     .then(function (data) {
                                         res.send(200);
                                     });
                                 return;
                             };


                             var cookbook = JSON.stringify(res);

                             var stringResult = '';

                             Object.keys(res).forEach(function(cookbook) {
                                 var version = res[cookbook].versions[0].version;
                                 stringResult += cookbook + ' ' + 'version: ' + version + '<br>';
                             });

                             hipchat.sendMessage(req.clientInfo, req.context.item.room.id, stringResult, options)
                                 .then(function (data) {
                                     res.send(200);
                                 });
                         });
                     } else if (command.optionList == 'license') {

                         chef.getLicense(function(err, res) {
                             if(err) {
                                 var options = {
                                     options: {
                                         color: "red"
                                     }
                                 };
                                 hipchat.sendMessage(req.clientInfo, req.context.item.room.id, '<strong>'+err.toString()+'</strong>', options)
                                     .then(function (data) {
                                         res.send(200);
                                     });
                                 return;
                             };


                             hipchat.sendMessage(req.clientInfo, req.context.item.room.id, res, options)
                                 .then(function (data) {
                                     res.send(200);
                                 });
                         });
                     } else {

                         stringResult = "chef command not recognized.";
                         options = {
                             options: {
                                 color: "red"
                             }
                         };
                         hipchat.sendMessage(req.clientInfo, req.context.item.room.id, stringResult, options)
                     }});
             });

    // This is an example sidebar controller that can be launched when clicking on the glance.
    // https://developer.atlassian.com/hipchat/guide/hipchat-ui-extensions/views/sidebar
    app.get('/sidebar',
            addon.authenticate(),
            function(req, res) {
                res.render('sidebar', {
                    identity: req.identity
                });
            }
           );

    // This is an example dialog controller that can be launched when clicking on the glance.
    // https://developer.atlassian.com/hipchat/guide/hipchat-ui-extensions/views/dialog
    app.get('/dialog',
            addon.authenticate(),
            function(req, res) {
                res.render('dialog', {
                    identity: req.identity
                });
            }
           );

    // Sample endpoint to send a card notification back into the chat room
    // https://www.hipchat.com/docs/apiv2/method/send_room_notification.
    // For more information on Cards, take a look at:
    // https://developer.atlassian.com/hipchat/guide/hipchat-ui-extensions/cards
    app.post('/send_notification',
             addon.authenticate(),
             function (req, res) {
                 var card = {
                     "style": "link",
                     "url": "https://www.hipchat.com",
                     "id": uuid.v4(),
                     "title": "El HipChat!",
                     "description": "Great teams use HipChat: Group and private chat, file sharing, and integrations",
                     "icon": {
                         "url": "https://hipchat-public-m5.atlassian.com/assets/img/hipchat/bookmark-icons/favicon-192x192.png"
                     }
                 };
                 var msg = '<b>' + card.title + '</b>: ' + card.description;
                 var opts = {'options': {'color': 'yellow'}};
                 hipchat.sendMessage(req.clientInfo, req.identity.roomId, msg, opts, card);
                 res.json({status: "ok"});
             }
            );

    // This is an example route to handle an incoming webhook
    // https://developer.atlassian.com/hipchat/guide/webhooks
    app.post('/webhook',
             addon.authenticate(),
             function(req, res) {
                 hipchat.sendMessage(req.clientInfo, req.context.item.room.id, 'pong')
                     .then(function(data){
                         res.sendStatus(200);
                     });
             }
            );

    // Notify the room that the add-on was installed. To learn more about
    // Connect's install flow, check out:
    // https://developer.atlassian.com/hipchat/guide/installation-flow
    addon.on('installed', function (clientKey, clientInfo, req) {
        var options = {
            options: {
                color: "green"
            }
        };
        var msg = "The Chef Server add-on has been installed into this room.";
        hipchat.sendMessage(clientInfo, req.body.roomId, msg, options);
    });

    // Clean up clients when uninstalled
    addon.on('uninstalled', function(id){
        addon.settings.client.keys(id+':*', function(err, rep){
            rep.forEach(function(k){
                addon.logger.info('Removing key:', k);
                addon.settings.client.del(k);
            });
        });
    });

};

function parseCommand(cmd) {
    var fullCommand = cmd.substr(cmd.indexOf(" ") + 1, cmd.length - 1);
    var command = fullCommand.substr(0, fullCommand.indexOf(" ") + 1);
    var allOptions = fullCommand.substr(fullCommand.indexOf(command) + command.length);
    var optionList = allOptions.split(" ");
    return {
        command: command,
        optionList: optionList
    };
}
