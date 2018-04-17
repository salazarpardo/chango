// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Posts } from '../posts.js';

Meteor.publish('posts', function (options) {
  return Posts.find();
});

Meteor.publish('singlePost', function(id) {
  check(id, String);
  return Posts.find(id);
});
