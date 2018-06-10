import { ServiceConfiguration } from 'meteor/service-configuration';

var settings = Meteor.settings.private.facebook,
    appId    = settings.appId,
    secret   = settings.secret;

ServiceConfiguration.configurations.upsert(
  { service: 'facebook' },
  {
    $set: {
      appId: appId,
      loginStyle: 'popup',
      secret: secret
    }
  }
);
