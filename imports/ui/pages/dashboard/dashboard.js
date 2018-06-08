import './dashboard.html';

import { Comments } from '/imports/api/comments/comments.js';

import '../../components/posts/posts_list.js';
import '../../components/comments/comment_item.js';


Template.dashboard.helpers({
  'comments'() {
    return Comments.find({userId: Meteor.userId()});
  },
  'commentsCount'() {
    return Comments.find({userId: Meteor.userId()}).count();
  }
});


Template.dashboard.onCreated(function () {

  var instance = this;

  instance.subscribe('userComments');

});
