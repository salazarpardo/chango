import { Errors } from "/client/helpers/errors.js";

import "./errors.html";

Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});

Template.error.onRendered(function() {
  var error = this.data;
  Meteor.setTimeout(function() {
    $(".alert-dismissible").alert("close");
    Errors.remove(error._id);
  }, 5000);
});
