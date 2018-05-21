import { Notifications } from '/imports/api/notifications/notifications.js';

import fontawesome from '@fortawesome/fontawesome/';
import faBell from '@fortawesome/fontawesome-free-regular/faBell'

fontawesome.library.add(faBell)

import './notifications.html';

Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({userId: Meteor.userId(), read: false});
  },
  notificationCount: function(){
      return Notifications.find({userId: Meteor.userId(), read: false}).count();
  }
});

Template.notificationItem.helpers({
  notificationPostPath: function() {
    return Router.routes.postPage.path({_id: this.postId});
  }
});

Template.notificationItem.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
});
