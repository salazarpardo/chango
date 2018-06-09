import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { Notifications } from '/imports/api/notifications/notifications.js';

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
    return FlowRouter.path('postPage', {_id: this.postId});
  }
});

Template.notificationItem.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
});

Template.notificationsWidget.helpers({
  notifications: function() {
    return Notifications.find({userId: Meteor.userId(), read: false});
  },
  notificationCount: function(){
    let notificationCount = Notifications.find({userId: Meteor.userId(), read: false}).count();
    
    return notificationCount;
  },
  notificationIconClass: function(){
    let notificationCount = Notifications.find({userId: Meteor.userId(), read: false}).count();
    if (notificationCount > 0 ) {
      return 'fas fa-bell text-primary';
    }
    return 'far fa-bell text-muted';
  }
});

Template.notificationsWidgetItem.helpers({
  notificationPostPath: function() {
    return FlowRouter.path('postPage', {_id: this.postId});
  }
});

Template.notificationsWidgetItem.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
});
