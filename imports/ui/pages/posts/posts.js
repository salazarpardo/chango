import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Posts } from "/imports/api/posts/posts.js";
import { subs } from "/imports/api/posts/posts.js";
import { Meteor } from "meteor/meteor";

import "./posts.html";

import "../../components/posts/posts_list.js";
import "../../components/posts/posts_map.js";

Template.posts.onCreated(function () {
  Meteor.startup(function () {
    GoogleMaps.load({ key: Meteor.settings.public.GoogleMaps });
  });
  // 1. Initialization

  var instance = this;

  instance.ready = new ReactiveVar(false);

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(5);
  instance.sortby = new ReactiveVar({ submitted: -1, _id: -1 });
  instance.query = new ReactiveVar({});

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes

  instance.autorun(function () {
    var route = FlowRouter.getRouteName();

    if (route === "tag") {
      var tag = "#" + FlowRouter.getParam("tag");
      if (tag !== undefined) {
        instance.query.set({ "tags.value": tag });
      }
    } else if (route === "best") {
      instance.sortby.set({
        votes: -1,
        commentsCount: -1,
        submitted: -1,
        _id: -1,
      });
      instance.query.set({});
    } else {
      instance.sortby.set({ submitted: -1, _id: -1 });
      instance.query.set({});
    }
    // get the limit and sort
    var limit = instance.limit.get();
    var sortby = instance.sortby.get();
    var query = instance.query.get();

    var posts = subs.subscribe("posts", sortby, limit, query);

    // subscribe to the posts publication

    // var newPosts = subs.subscribe("posts", sortby, limit, query);

    // if subscription is ready, set limit to newLimit
    if (subs.ready()) {
      instance.loaded.set(limit);
      instance.ready.set(true);
      // 3. Cursor
    } else {
      console.log("Subscription is not ready yet.");
    }

    instance.posts = function () {
      return Posts.find(instance.query.get(), {
        sort: instance.sortby.get(),
        limit: instance.loaded.get(),
      });
    };
  });
});

Template.posts.helpers({
  map: function () {
    return true;
  },
  routeOption: function (optionName) {
    FlowRouter.watchPathChange();
    return FlowRouter.current().route.options[optionName];
  },
  tag: function () {
    var query = Template.instance().query.get();
    return query["tags.value"];
  },
  ready: function () {
    return Template.instance().ready.get();
  },
  posts: function () {
    return Template.instance().posts();
  },
  limit: function () {
    return Template.instance().limit;
  },
  hasMorePosts: function () {
    return (
      Template.instance().posts().count() >= Template.instance().limit.get()
    );
  },
});
