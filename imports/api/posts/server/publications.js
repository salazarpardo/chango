// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Posts } from '../posts.js';

Meteor.publish('posts.all', function () {
  return Posts.find({}, {fields: {
    createdAt: false
  }});
});

Meteor.publish('post.single', function (postId) {
  return Posts.find({ _id: postId });
});
