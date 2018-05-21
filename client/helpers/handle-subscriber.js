import { Meteor } from 'meteor/meteor';

handleSubscriber = function( subscriber ) {
  Meteor.call( "handleSubscriber", subscriber, ( error, response ) => {
    if ( error ) {
      console.log(error);
      return throwError(error.reason);
    } else {
      console.log(response);
      if ( response.complete || response.unique_email_id ) {
        var subscribeMessage   = subscriber.email + " se ha suscrito a la lista",
            unsubscribeMessage = subscriber.email + " ha salido de la lista",
            message            = subscriber.action === "subscribe" ? subscribeMessage : unsubscribeMessage;
         throwError(message, 'alert-success');
      } else {
        throwError(response.message);
      }
    }
  });
};



validateEmail = function (email) {
  var errors = {};
  console.log(isEmailValid(email));

  if (!email.address)
    errors.email = "Please provide an email address";

  if (email.address && !isEmailValid(email))
    errors.email = "Please provide a valid email address";

  return errors;
}

isEmailValid = function(address) {
  console.log(address.address);
  return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(address.address);
};
