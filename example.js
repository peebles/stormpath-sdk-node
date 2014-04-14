'use strict';

var stormpath = require('./lib');

var homeDir = process.env[(process.platform === 'win32' ? 'USERPROFILE' : 'HOME')];
var apiKeyFilePath = homeDir + '/.stormpath/apiKey.properties';

var client = null; //available after the ApiKey is loaded from disk (api key is needed to instantiate the client).

stormpath.loadApiKey(apiKeyFilePath, function (err, apiKey) {
  if (err) throw err;

  client = new stormpath.Client({apiKey: apiKey});
  client.getCurrentTenant(function (err, tenant) {
    if (err) throw err;
    onTenantReady(tenant);
  });
});

function onTenantReady(tenant) {
  listAppsAndDirs(tenant);
  listAppsAndDirs(client);
  doAppCrud(client);
  doDirCrud(client);
}

function listAppsAndDirs(clientOrTenant) {

  clientOrTenant.getApplications()
    .search('Stormpath')
    .orderBy({name: 1})
    .expand({accounts: {offset: 0, limit: 60}, groups: true})
    .exec(function (err, apps) {
    if (err) throw err;

    apps.each(function (err, app, offset) {
      if (err) throw err;

      console.log(offset + ": ");
      console.log(app);

      app.getAccounts(function (err, accts) {
        if (err) throw err;

        accts.each(function (err, acct, offset) {
          console.log(acct);
          acct.customData.boom = 'test';

          acct.customData.save(function(err, customData){
            if (err) throw err;
            console.log(customData);
            if (customData.boom !== 'test'){
              throw new Error('custom data should have field "boom" with value "test" ');
            }
            customData.remove('boom', function(){
              if (err) throw err;
              if (!!customData.boom){
                throw new Error('custom data should not have field "boom"');
              }
            });
          });
        });
      });

      app.getGroups(function (err, groups) {
        if (err) throw err;

        groups.each(function (err, group, offset) {
          console.log(group);
        });
      });

    });
  });

  clientOrTenant.getDirectories(function (err, dirs) {
    if (err) throw err;

    dirs.each(function (err, dir, offset) {
      if (err) throw err;

      console.log(dir);

      dir.getAccounts(function (err, accts) {
        if (err) throw err;

        accts.each(function (err, acct, offset) {
          console.log(acct);
        });
      });

      dir.getGroups(function (err, groups) {
        if (err) throw err;

        groups.each(function (err, group, offset) {
          console.log(group);
        });
      });

    });
  });
}

function doAppCrud(client) {

  client.getCurrentTenant(function (err, tenant) {
    if (err) throw err;

    //Create:
    tenant.createApplication({name: 'Just Testing! Delete me.'}, function onCreateApp(err, app) {
      if (err) throw err;

      console.log(app);

      //Read:
      client.getApplication(app.href, function onReadApp(err, app2) {
        if (err) throw err;

        console.log(app2);

        //Update:
        app2.name = 'Just Testing Again!.  Delete me (really).';
        app2.save(function onSaveApp(err, app3) {
          if (err) throw err;

          console.log(app3);

          //Delete:
          app3.delete(function onDeleteApp(err) {
            if (err) throw err;

            console.log("App deleted!");
          });

        });

      });

    });

  });
}

function doDirCrud(client) {

  client.getCurrentTenant(function (err, tenant) {
    if (err) throw err;

    //Create:
    tenant.createDirectory({name: 'Testing NodeJS SDK. Delete me!'}, function (err, dir) {
      if (err) throw err;

      console.log(dir);

      //Read:
      client.getDirectory(dir.href, function (err, dir2) {
        if (err) throw err;

        console.log(dir2);

        //Update:
        dir2.name = 'Testing NodeJS SDK. Delete me really!';
        dir2.save(function (err, dir3) {
          if(err) throw err;
          console.log(dir3);

          //Delete:
          dir3.delete(function (err) {
            if (err) throw err;
            console.log("Dir deleted!");

          });

        });

      });

    });

  });

}


