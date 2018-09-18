// All links-related publications

import { Meteor } from "meteor/meteor";
import { Posts } from "../posts.js";

Meteor.publish("posts", function(sort, limit) {
  check(sort, Object);
  check(limit, Number);
  return Posts.find({}, { sort: sort, limit: limit });
});

Meteor.publish("singlePost", function(slug) {
  check(slug, String);
  return Posts.find({ slug: slug });
});
