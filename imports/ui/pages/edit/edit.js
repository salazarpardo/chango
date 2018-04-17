import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Posts } from '/imports/api/posts/posts.js';

import './edit.html';


Template.postEdit.onCreated(function() {
    var postId = FlowRouter.getParam('_id');
    var self = this;
    console.log(postId);
    self.autorun(function() {
      if ( postId !== undefined ) {
        self.subscribe('singlePost', postId);
      }
    });
});

Template.postEdit.helpers({
  post() {
    var postId = FlowRouter.getParam('_id');
    console.log(postId);
    if ( postId !== undefined ) {
      return Posts.findOne({ _id: postId });
    }
  },
  errorMessage(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass (field) {
    return !!Session.get('postEditErrors')[field] ? 'is-invalid' : '';
  }
});

Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;

    var postProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    var errors = validatePost(postProperties);
    if (errors.title || errors.url)
      return Session.set('postEditErrors', errors);

    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        FlowRouter.go('post', {_id: currentPostId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      FlowRouter.go('home');
    }
  }
});
