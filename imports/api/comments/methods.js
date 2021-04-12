// Methods related to Posts

import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Posts } from "../posts/posts.js";
import { Comments } from "./comments.js";

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      postId: String,
      body: String,
      postSlug: String
    });

    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);

    if (!post)
      throw new Meteor.Error("invalid-comment", "You must comment on a post");

    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username || user.profile.name,
      submitted: new Date()
    });

    // update the post with the number of comments
    Posts.update(comment.postId, { $inc: { commentsCount: 1 } });

    // create the comment, save the id
    comment.slug = Comments.insert(comment);

    // now create a notification, informing the user that there's been a comment
    createCommentNotification(comment);

    return comment.slug;
  }
});
