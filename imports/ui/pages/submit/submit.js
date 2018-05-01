import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Match } from 'meteor/check'

import { Posts } from '/imports/api/posts/posts.js';
import { Meteor } from 'meteor/meteor';

import './submit.html';

Template.submit.onCreated(function () {
  Session.set('postSubmitErrors', {});
});

Template.submit.helpers({
  'currentUrl'() {
    return window.location.origin;
  },
  'errorMessage'(field) {
    return Session.get('postSubmitErrors')[field];
  },
  'errorClass'(field) {
    return !!Session.get('postSubmitErrors')[field] ? 'is-invalid' : '';
  }
});

Template.submit.events({
  'blur [name="title"]'() {
    var form  = $("#add-post"),
        title = form.find("[name='title']"),
        slug  = form.find("[name='slug']");
    var isValid = title[0].validity.valid;
    console.log(title);
    console.log(isValid);
    if (isValid) {
      var formatted = formatSlug(title.val())
      slug.val(formatted);
    } else {
      slug.val("");
    }
  },
  'submit form'(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
      slug: $(e.target).find('[name=slug]').val(),
    };

    var errors = validatePost(post);
    if (errors.title || errors.url)
      return Session.set('postSubmitErrors', errors);

    Meteor.call('posts.insert', post, (error, result) => {
      if (error) {
        return throwError(error.reason);
      }
      if (result.postExists) {
        throwError('There is a post with the same slug, please change it');
      } else {
        FlowRouter.go('post', {slug: result.slug});
      }
    });

  }
});
