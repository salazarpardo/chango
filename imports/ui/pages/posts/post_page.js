import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Posts } from '/imports/api/posts/posts.js';

import './post_page.html';

import '../../components/posts/post_item.js';

Template.postPage.onCreated(function() {
    var postId = FlowRouter.getParam('_id');
    if ( postId !== undefined ) {
      Meteor.subscribe('post.single', postId);
    }
});

Template.postPage.helpers({
  post: function() {
    var postId = FlowRouter.getParam('_id');
    if ( postId !== undefined ) {
      console.log(Posts.findOne({ _id: postId }));
      return Posts.findOne({ _id: postId });
    }
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  }
});
