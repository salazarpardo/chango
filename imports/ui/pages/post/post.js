import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Posts } from '/imports/api/posts/posts.js';
import { Comments } from '/imports/api/comments/comments.js';

import './post.html';

import '../../components/posts/post_item.js';
import '../../components/comments/comment_item.js';
import '../../components/comments/comment_submit.js';

Template.post.onCreated(function() {
  var postId = FlowRouter.getParam('_id');
  var self = this;
  self.subscribe('comments', postId);
  self.autorun(function() {
    if ( postId !== undefined ) {
      self.subscribe('singlePost', postId);
    }
  });
});

Template.post.helpers({
  post() {
    var postId = FlowRouter.getParam('_id');
    if ( postId !== undefined ) {
      return Posts.findOne({ _id: postId });
    }
  },
  comments() {
    var postId = FlowRouter.getParam('_id');
    console.log(Comments.find({postId: postId }));
    if ( postId !== undefined ) {
      return Comments.find({postId: postId });
    }
  },
  domain() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  }
});
