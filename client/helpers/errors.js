// Local (client-only) collection

import { Mongo } from 'meteor/mongo';

export const Errors = new Mongo.Collection(null);

throwError = function(message, alertClass) {
  if (!alertClass ) {
    alertClass = 'alert-danger';
  }
  Errors.insert({message: message, alertClass: alertClass});
};
