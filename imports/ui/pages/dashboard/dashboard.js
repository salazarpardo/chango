import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Posts } from '/imports/api/posts/posts.js';
import { Comments } from '/imports/api/comments/comments.js';
import { Meteor } from 'meteor/meteor';

import './dashboard.html';

import '../../components/posts/posts_list.js';
import '../../components/comments/comment_item.js';

Template.dashboard.onCreated(function () {

  // 1. Initialization

  var instance = this;

  instance.subscribe('userComments');
  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(5);
  instance.sortby = new ReactiveVar({submitted: -1, _id: -1});

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  instance.autorun(function () {
    FlowRouter.watchPathChange();
    if (FlowRouter.current().route.name == 'best') {
      instance.sortby.set({votes: -1, submitted: -1, _id: -1});
    } else if (FlowRouter.current().route.name == 'map') {
      instance.sortby.set({location: -1, submitted: -1, _id: -1});
    } else {
      instance.sortby.set({submitted: -1, _id: -1});
    }
    // get the limit and sort
    var limit = instance.limit.get();
    var sortby = instance.sortby.get();

    // subscribe to the posts publication
    var subscription = instance.subscribe('posts', sortby, limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      instance.loaded.set(limit);
    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.posts = function() {
    return Posts.find({}, {sort: {submitted: -1, _id: -1}, limit: instance.loaded.get()});
  }
  instance.bestPosts = function() {
    return Posts.find({}, {sort: {votes: -1, submitted: -1, _id: -1}, limit: instance.loaded.get()});
  }
  instance.commentedPosts = function() {
    return Posts.find({}, {sort: {commentsCount: -1, votes: -1, submitted: -1, _id: -1}, limit: instance.loaded.get()});
  }
  instance.userComments = function() {
    return Comments.find({userId: Meteor.userId()}, {limit: instance.loaded.get()});
  }

});

Template.dashboard.helpers({
  'comments'() {
    return Template.instance().userComments();
  },
  'commentsCount'() {
    return Template.instance().userComments().count();
  },
  'posts'() {
    console.log(Template.instance().posts());
    return Template.instance().posts();
  },
  'bestPosts'() {
    return Template.instance().bestPosts();
  },
  'commentedPosts'() {
    return Template.instance().commentedPosts();
  },
  'hasMorePosts'() {
    return false;
  },
});
