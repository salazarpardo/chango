import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Posts } from "/imports/api/posts/posts.js";
import { subs } from "/imports/api/posts/posts.js";
import { Meteor } from "meteor/meteor";

import "./posts.html";

import "../../components/posts/posts_list.js";
import "../../components/posts/posts_map.js";

Template.posts.onCreated(function() {
  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(5);
  instance.sortby = new ReactiveVar({ submitted: -1, _id: -1 });
  instance.query = new ReactiveVar({});

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  instance.autorun(function() {
    FlowRouter.watchPathChange();
    if (FlowRouter.current().route.name == "best") {
      instance.sortby.set({
        votes: -1,
        commentsCount: -1,
        submitted: -1,
        _id: -1
      });
    } else if (FlowRouter.current().route.name == "tag") {
      var tag = "#" + FlowRouter.getParam("tag");
      if (tag !== undefined) {
        instance.query.set({ "tags.value": tag });
      }
    } else {
      instance.sortby.set({ submitted: -1, _id: -1 });
    }
    // get the limit and sort
    var limit = instance.limit.get();
    var sortby = instance.sortby.get();
    var query = instance.query.get();

    // subscribe to the posts publication
    var subscription = subs.subscribe("posts", sortby, limit, query);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      instance.loaded.set(limit);
    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.posts = function() {
    return Posts.find(instance.query.get(), {
      sort: instance.sortby.get(),
      limit: instance.loaded.get()
    });
  };
});

Template.posts.helpers({
  map: function() {
    return true;
  },
  routeOption: function(optionName) {
    FlowRouter.watchPathChange();
    return FlowRouter.current().route.options[optionName];
  },
  posts: function() {
    return Template.instance().posts();
  },
  limit: function() {
    return Template.instance().limit;
  },
  hasMorePosts: function() {
    return (
      Template.instance()
        .posts()
        .count() >= Template.instance().limit.get()
    );
  }
});
