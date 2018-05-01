import { Comments } from '/imports/api/comments/comments.js';

import './post_item.html';

import fontawesome from '@fortawesome/fontawesome/';
import faArrowUp from '@fortawesome/fontawesome-free-solid/faArrowUp'

fontawesome.library.add(faArrowUp)

Template.postItem.helpers({
  ownPost() {
    return this.userId === Meteor.userId();
  },
  domain() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
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
