import { Comments } from '/imports/api/comments/comments.js';

import './post_item.html';


Template.postItem.helpers({
  ownPost() {
    return this.userId === Meteor.userId();
  },
  domain() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
});
