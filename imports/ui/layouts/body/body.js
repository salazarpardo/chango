import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './body.html';

import { Errors } from '/client/helpers/errors.js';

import '../../components/errors/errors.js';

Template.App_body.helpers({
  routeClass: function() {
    FlowRouter.watchPathChange();
    return FlowRouter.current().route.name;
  }
});

Template.App_body.onRendered(function() {

  this.find('#main, #page')._uihooks = {
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
