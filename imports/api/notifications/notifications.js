// Definition of the notifications collection

import { Mongo } from "meteor/mongo";
import { Posts } from "/imports/api/posts/posts.js";

export const Notifications = new Mongo.Collection("notifications");

Notifications.allow({
  update: function(userId, doc, fieldNames) {
    return (
      ownsDocument(userId, doc) &&
      fieldNames.length === 1 &&
      fieldNames[0] === "read"
    );
  }
});

createCommentNotification = function(comment) {
  var post = Posts.findOne(comment.postId);
  if (comment.userId !== post.userId) {
    Notifications.insert({
      userId: post.userId,
      postSlug: post.slug,
      commentId: comment._id,
      commenterName: comment.author,
      read: false
    });
  }
};

createMentionNotification = function(post) {
  if (post.mentions) {
    post.mentions.forEach(function(element) {
      var mention = element.value.substr(1);
      var user = Meteor.users.findOne({ username: mention });
      if (user && user._id !== post.userId) {
        Notifications.insert({
          userId: user._id,
          postSlug: post.slug,
          commentId: post._id,
          commenterName: post.author,
          read: false,
          mention: true
        });
      }
    });
  }
};
