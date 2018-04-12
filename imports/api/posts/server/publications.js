// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Posts } from '../posts.js';

Meteor.publish('posts.all', function () {
  return Posts.find({}, {fields: {
    createdAt: false
  }});
});
