import { Errors } from '/client/helpers/errors.js';

import './errors.html';

Template.errors.helpers({
  errors: function() {
    console.log(Errors.find());
    return Errors.find();
  }
});

Template.error.onRendered(function() {
  var error = this.data;
  Meteor.setTimeout(function () {
    Errors.remove(error._id);
  }, 3000);
});
