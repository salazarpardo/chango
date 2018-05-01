import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Posts } from '/imports/api/posts/posts.js';
import { Comments } from '/imports/api/comments/comments.js';

import './post.html';

import '../../components/posts/post_item.js';
import '../../components/comments/comment_item.js';
import '../../components/comments/comment_submit.js';

Template.post.onCreated(function() {
  var postSlug = FlowRouter.getParam('slug');
  var self = this;
  self.autorun(function() {
    if ( postSlug !== undefined ) {
      self.subscribe('singlePost', postSlug);
      self.subscribe('comments', postSlug);
    }
  });
});

Template.post.helpers({
  'post'() {
    var postSlug = FlowRouter.getParam('slug');
    if ( postSlug !== undefined ) {
      return Posts.findOne({ slug: postSlug });
    }
  },
  'comments'() {
    var postSlug = FlowRouter.getParam('slug');
    if ( postSlug !== undefined ) {
      return Comments.find({postSlug: postSlug });
    }
  },
  'domain'() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  }
});
