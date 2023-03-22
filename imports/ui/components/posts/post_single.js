import { Comments } from "/imports/api/comments/comments.js";

import "./post_single.html";

Template.postSingle.helpers({
  ownPost() {
    return this.userId === Meteor.userId();
  },
  postUrl() {
    return window.location.href;
  },
  upvotedClass() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return "upvotable";
    } else if (_.include(this.upvoters, userId)) {
      return "disabled upvoted";
    } else {
      return "disabled";
    }
  },
  upvoteIconClass() {
    var userId = Meteor.userId();
    if (!_.include(this.upvoters, userId)) {
      return "far fa-thumbs-up";
    } else {
      return "fas fa-thumbs-up";
    }
  },
  commentClass() {
    var userId = Meteor.userId();
    if (userId) {
      return "commentable";
    } else {
      return "disabled";
    }
  },
});

Template.postSingle.events({
  "click .upvotable": function (e) {
    e.preventDefault();
    Meteor.call("upvote", this._id);
    analytics.track("Upvoted Idea", {
      eventName: "Idea",
    });
  },
  "click .comment.btn-logged-out ": function () {
    analytics.track("Tried to Comment Idea", {
      eventName: "Idea",
    });
  },
  "click .upvote.btn-logged-out ": function () {
    analytics.track("Tried to Upvote Idea", {
      eventName: "Idea",
    });
  },
  "click #share .btn": function () {
    analytics.track("Shared Idea", {
      eventName: "Idea",
    });
  },
});
