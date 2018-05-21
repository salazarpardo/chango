import { Comments } from '/imports/api/comments/comments.js';

import './post_single.html';

import fontawesome from '@fortawesome/fontawesome/';
import faThumbsUp from '@fortawesome/fontawesome-free-regular/faThumbsUp'
import faCommentAlt from '@fortawesome/fontawesome-free-regular/faCommentAlt'

fontawesome.library.add(faThumbsUp)
fontawesome.library.add(faCommentAlt)

Template.postSingle.helpers({
  ownPost() {
    return this.userId === Meteor.userId();
  },
  // domain() {
  //   var a = document.createElement('a');
  //   a.href = this.url;
  //   return a.hostname;
  // },
  upvotedClass() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  }
});

Template.postSingle.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  },
});
