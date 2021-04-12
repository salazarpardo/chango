import { Comments } from "/imports/api/comments/comments.js";

import "./post_item.html";

Template.postItem.helpers({
  ownPost() {
    return this.userId === Meteor.userId();
  },
  // domain() {
  //   var a = document.createElement('a');
  //   a.href = this.url;
  //   return a.hostname;
  // },
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
  }
});

Template.postItem.events({
  "click .upvotable": function(e) {
    e.preventDefault();
    Meteor.call("upvote", this._id);
    analytics.track("Upvoted Idea", {
      eventName: "Idea"
    });
  }
});
