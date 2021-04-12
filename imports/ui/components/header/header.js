import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "./header.html";

import "../notifications/notifications.js";

Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
      FlowRouter.watchPathChange();
      return FlowRouter.current() && FlowRouter.current().route.name === name;
    });

    return active && "active";
  },
  getQueryParams() {
    FlowRouter.watchPathChange();
    var currentPath = FlowRouter.current().path;
    var params = {
      next: currentPath
    };
    return FlowRouter._qs.stringify(params);
  }
});

Template.header.onCreated(function() {
  var instance = this;

  instance.subscribe("notifications");
});
