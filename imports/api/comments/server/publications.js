// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Comments } from '../comments.js';

Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});
