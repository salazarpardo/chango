import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "./footer.html";

Template.footer.helpers({
  getQueryParams() {
    FlowRouter.watchPathChange();
    var currentPath = FlowRouter.current().path;
    console.log(currentPath);
    var params = {
      next: currentPath
    };
    console.log(params);
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
