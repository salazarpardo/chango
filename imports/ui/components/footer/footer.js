import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "./footer.html";

Template.footer.helpers({
  getQueryParams() {
    FlowRouter.watchPathChange();
    var params = {
      next: window.location.pathname
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
