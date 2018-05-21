import { Comments } from '/imports/api/comments/comments.js';

import './post_item.html';

import fontawesome from '@fortawesome/fontawesome/';
import faThumbsUp from '@fortawesome/fontawesome-free-regular/faThumbsUp'

fontawesome.library.add(faThumbsUp)

Template.postItem.helpers({
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

Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  },
});
