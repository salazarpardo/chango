import './comment_submit.html';

Template.commentSubmit.onCreated(function() {
  Session.set('commentSubmitErrors', {});
});

Template.commentSubmit.helpers({
  'errorMessage'(field) {
    return Session.get('commentSubmitErrors')[field];
  },
  'errorClass'(field) {
    return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.commentSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();
    var $body = $(e.target).find('[name=body]');
    var comment = {
      body: $body.val(),
      postId: template.data._id,
      postSlug: template.data.slug
    };

    var errors = {};
    if (! comment.body) {
      errors.body = "Por favor escribe un comentario";
      return Session.set('commentSubmitErrors', errors);
    }

    Meteor.call('commentInsert', comment, function(error, commentId) {
      if (error){
        throwError(error.reason, 'alert-danger');
      } else {
        $body.val('');
      }
    });
  }
});
