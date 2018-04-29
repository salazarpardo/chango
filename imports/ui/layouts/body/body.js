import './body.html';

import { Errors } from '/client/helpers/errors.js';

import '../../components/errors/errors.js';

Template.App_body.helpers({

});

Template.App_body.onRendered(function() {
  this.find('#main')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    },
    removeElement: function(node) {
      $(node).fadeOut(function() {
        $(this).remove();
      });
    }
  }
});
