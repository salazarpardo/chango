// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Comments } from '../comments.js';

Meteor.publish('comments', function () {
  return Comments.find();
});
