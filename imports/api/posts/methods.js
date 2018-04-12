// Methods related to Posts

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Posts } from './posts.js';

Meteor.methods({
  'posts.insert'(title, url) {
    check(url, String);
    check(title, String);

    return Posts.insert({
      url,
      title,
      createdAt: new Date(),
    });
  },
});
