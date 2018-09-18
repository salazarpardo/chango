import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

import Mailchimp from "mailchimp-api-v3";

var settings = Meteor.settings.private.MailChimp,
  chimp = new Mailchimp(settings.apiKey),
  listId = settings.listId;

Meteor.methods({
  handleSubscriber: function(subscriber) {
    check(subscriber, {
      email: String,
      action: String
    });
    try {
      var subscribe = chimp.post("/lists/" + listId + "/members", {
        email_address: subscriber.email,
        status: "subscribed"
      });

      return subscribe;
    } catch (exception) {
      console.log(exception);
      return exception;
    }
  }
});
