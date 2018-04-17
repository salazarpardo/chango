import { Comments } from '/imports/api/comments/comments.js';

import './post_item.html';

Template.postItem.onCreated(function() {
  this.subscribe('comments');
});

Template.postItem.helpers({
  ownPost() {
    return this.userId === Meteor.userId();
  },
  domain() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  commentsCount() {
    return Comments.find({postId: this._id}).count();
  }
});
