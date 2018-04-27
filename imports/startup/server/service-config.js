import { ServiceConfiguration } from 'meteor/service-configuration';

ServiceConfiguration.configurations.upsert(
  { service: 'facebook' },
  {
    $set: {
      appId: '346017765802145',
      loginStyle: 'popup',
      secret: '16326bd5e4fb1efcf12d297e825a90a7'
    }
  }
);
