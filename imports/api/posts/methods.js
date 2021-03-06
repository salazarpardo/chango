// Methods related to Posts

import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Posts } from "./posts.js";

Posts.allow({
  update: function(userId, post) {
    return ownsDocument(userId, post);
  },
  remove: function(userId, post) {
    return ownsDocument(userId, post);
  }
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    createMentionNotification(post);
    // may only edit the following fields:
    return (
      _.without(
        fieldNames,
        "description",
        "text",
        "tags",
        "mentions",
        "category",
        "address",
        "location",
        "title",
        "icon"
      ).length > 0
    );
  }
});

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title;
  }
});

Meteor.methods({
  "posts.insert"(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      // url: String,
      slug: String,
      location: [String],
      address: String,
      description: String,
      text: String,
      category: String,
      tags: [Object],
      mentions: [Object],
      icon: Number
    });

    var postWithSameURL = Posts.findOne({ slug: postAttributes.slug });
    if (postWithSameURL) {
      return {
        postExists: true,
        slug: postWithSameURL.slug
      };
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username || user.profile.name,
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });

    var postId = Posts.insert(post);

    // now create a notification, informing the user if there's been a mention
    createMentionNotification(post);

    return {
      _id: postId,
      slug: postAttributes.slug
    };
  },
  upvote(postId) {
    check(this.userId, String);
    check(postId, String);

    var affected = Posts.update(
      {
        _id: postId,
        upvoters: { $ne: this.userId }
      },
      {
        $addToSet: { upvoters: this.userId },
        $inc: { votes: 1 }
      }
    );

    if (!affected)
      throw new Meteor.Error("invalid", "You weren't able to upvote that post");
  }
});
