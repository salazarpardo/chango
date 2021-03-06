// All links-related publications

import { Meteor } from "meteor/meteor";
import { Comments } from "../comments.js";

Meteor.publish("comments", function(postSlug) {
  check(postSlug, String);
  return Comments.find({ postSlug: postSlug });
});

Meteor.publish("userComments", function(sort, limit) {
  return Comments.find({ userId: this.userId }, { sort: sort, limit: limit });
});
