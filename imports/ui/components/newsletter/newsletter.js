import "./newsletter.html";

import "/client/helpers/handle-subscriber.js";

Template.newsletterForm.onCreated(function() {
  Session.set("newsletterErrors", {});
});

Template.newsletterForm.helpers({
  errorMessage: function(field) {
    return Session.get("newsletterErrors")[field];
  },
  errorClass: function(field) {
    return !!Session.get("newsletterErrors")[field] ? "is-invalid" : "";
  }
});

Template.newsletterForm.events({
  "submit form": function(event) {
    event.preventDefault();
    var email = {
      address: $(event.target)
        .find("[name=emailAddress]")
        .val()
    };

    var errors = validateEmail(email);
    if (errors.email) {
      return Session.set("newsletterErrors", errors);
    } else {
      Session.set("newsletterErrors", errors);
    }

    var subscriber = handleSubscriber({
      email: email.address,
      action: "subscribe"
    });

    $(event.target).addClass("success");
  }
});
