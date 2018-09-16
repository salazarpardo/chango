import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "./body.html";

import { Errors } from "/client/helpers/errors.js";

import "../../components/errors/errors.js";

Template.App_body.helpers({
  routeClass: function() {
    return FlowRouter.getRouteName();
  }
});

Template.App_body.onRendered(function() {
  Session.set("documentTitle", "Chango");
  this.autorun(function() {
    var routeTitle = FlowRouter.current().route.options.title;
    FlowRouter.watchPathChange();
    if (routeTitle) {
      Session.set("documentTitle", routeTitle + " | Chango");
    }
    document.title = Session.get("documentTitle");
  });

  var self = this;

  this.find("#main, #page")._uihooks = {
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
  };
});
