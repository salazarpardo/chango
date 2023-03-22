import { ServiceConfiguration } from "meteor/service-configuration";

ServiceConfiguration.configurations.upsert(
  { service: "facebook" },
  {
    $set: {
      ...Meteor.settings.private.facebook,
    },
  }
);

ServiceConfiguration.configurations.upsert(
  { service: "google" },
  {
    $set: {
      ...Meteor.settings.private.google,
    },
  }
);
