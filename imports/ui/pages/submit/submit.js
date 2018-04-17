import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { Posts } from '/imports/api/posts/posts.js';
import { Meteor } from 'meteor/meteor';

import './submit.html';

Template.submit.onCreated(function () {
  Session.set('postSubmitErrors', {});
});

Template.submit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'is-invalid' : '';
  }
});

Template.submit.events({
  'submit form'(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    var errors = validatePost(post);
    if (errors.title || errors.url)
      return Session.set('postSubmitErrors', errors);

    Meteor.call('posts.insert', post, (error, result) => {
      if (error) {
        console.log(e.target);
        return throwError(error.reason);
      }
      if (result.postExists) {
        throwError('This link has already been posted');
      }
      FlowRouter.go('post', {_id: result._id});
    });

  }
});
