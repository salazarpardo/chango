// All links-related publications

import { Meteor } from "meteor/meteor";
import { Posts } from "../posts.js";

Meteor.publish("posts", function(sort, limit, query) {
  check(sort, Object);
  check(limit, Number);
  check(query, Object);
  return Posts.find(query, { sort: sort, limit: limit });
});

Meteor.publish("new", function(limit) {
  check(limit, Number);
  return Posts.find({}, { sort: { submitted: -1, _id: -1 }, limit: limit });
});

Meteor.publish("best", function(limit) {
  check(limit, Number);
  return Posts.find(
    {},
    {
      sort: {
        votes: -1,
        commentsCount: -1,
        submitted: -1,
        _id: -1
      },
      limit: limit
    }
  );
});

Meteor.publish("singlePost", function(slug) {
  check(slug, String);
  return Posts.find({ slug: slug });
});
