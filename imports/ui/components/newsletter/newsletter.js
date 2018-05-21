import './newsletter.html';

import '/client/helpers/handle-subscriber.js';

Template.newsletter.onCreated(function() {
  Session.set('newsletterErrors', {});
});

Template.newsletter.helpers({
  errorMessage: function(field) {
    return Session.get('newsletterErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('newsletterErrors')[field] ? 'is-invalid' : '';
  }
});

Template.newsletter.events({
  'submit form': function( event ) {
    event.preventDefault();
        console.log(event.target);
    var email = {
      address: $(event.target).find('[name=emailAddress]').val()
    };

    var errors = validateEmail(email);
    if (errors.email){
      return Session.set('newsletterErrors', errors);
    } else {
      Session.set('newsletterErrors', errors);
    }

    handleSubscriber({
      email: email.address,
      action: 'subscribe'
    });

    $(event.target).addClass('success');

  }
});
