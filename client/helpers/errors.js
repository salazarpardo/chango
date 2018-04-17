// Local (client-only) collection

import { Mongo } from 'meteor/mongo';

export const Errors = new Mongo.Collection(null);

throwError = function(message) {
  Errors.insert({message: message});
};
