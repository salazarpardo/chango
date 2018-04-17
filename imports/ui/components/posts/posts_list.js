import { Posts } from '/imports/api/posts/posts.js';
import { Meteor } from 'meteor/meteor';
import './posts_list.html';

import './post_item.js';

Meteor.startup(function() {
  Tracker.autorun(function() {
    console.log('There are ' + Posts.find().count() + ' posts');
  });
});

Template.postsList.onCreated(function () {
  Meteor.subscribe('posts');
});

Template.postsList.helpers({
  posts() {
    return Posts.find({}, {sort: {submitted: -1}});
  },
});

Template.postsList.events({
  'submit .info-post-add'(event) {
    event.preventDefault();

    const target = event.target;
    const title = target.title;
    const url = target.url;

    Meteor.call('posts.insert', title.value, url.value, (error) => {
      if (error) {
        alert(error.error);
      } else {
        title.value = '';
        url.value = '';
      }
    });
  },
});
