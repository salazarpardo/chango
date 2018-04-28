// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Posts } from '../posts.js';

Meteor.publish('posts', function(limit) {
  check(limit, Number);
  Meteor._sleepForMs(2000);
  return Posts.find({}, {limit: limit});
});

Meteor.publish('singlePost', function(id) {
  check(id, String);
  return Posts.find(id);
});
