import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "./footer.html";

Template.footer.helpers({
  currentYear() {
    return new Date().getFullYear();
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

Template.footer.events({
  "click .modal-body a": function() {
    $("#loginModal").modal("hide");
  },
  "click .modal-footer .btn": function() {
    $("#loginModal").modal("hide");
  }
});
