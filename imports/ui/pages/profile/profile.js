import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Posts } from "/imports/api/posts/posts.js";
import { subs } from "/imports/api/posts/posts.js";

import "./profile.html";

import "../../components/posts/posts_list.js";
import "../../components/skeleton/skeleton.js";

Template.profile.helpers({
  user() {
    console.log(Template.instance().user());
    return Template.instance().user();
  },
  posts() {
    return Template.instance().posts();
  },
  postReady() {
    if (subs.ready()) {
      return true;
    }
  },
  hasMorePosts() {
    return false;
  },
  isPublic() {
    FlowRouter.watchPathChange();
    if (FlowRouter.current().route.name == "user") {
      return true;
    }
  }
});

Template.profile.onCreated(function() {
  var self = this;

  // 1. Initialization

  // initialize the reactive variables
  self.loaded = new ReactiveVar(0);
  self.limit = new ReactiveVar(5);
  self.sortby = new ReactiveVar({ submitted: -1, _id: -1 });
  self.query = new ReactiveVar({});
  self.userQuery = new ReactiveVar();

  self.username = () => FlowRouter.getParam("username");
  console.log(self.username());
  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  self.autorun(() => {
    FlowRouter.watchPathChange();
    if (
      FlowRouter.current().route.name == "user" &&
      self.username() !== undefined
    ) {
      self.userQuery.set(self.username());
      self.query.set({ author: self.username() });
    } else if (
      FlowRouter.current().route.name == "profile" &&
      self.username() === undefined
    ) {
      if (Meteor.user() && Meteor.user().username) {
        self.query.set({ author: Meteor.user().username });
        self.userQuery.set(Meteor.user().username);
      } else if (Meteor.user() && Meteor.user().profile.name) {
        self.query.set({ author: Meteor.user().profile.name });
        self.userQuery.set(Meteor.user().profile.name);
      }
    } else {
      self.query.set({});
    }

    self.subscribe("userProfile", self.userQuery.get());

    // get the limit and sort
    var limit = self.limit.get();
    var sortby = self.sortby.get();
    var query = self.query.get();
    console.log(query);

    // subscribe to the posts publication
    var subscription = subs.subscribe("posts", sortby, limit, query);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      self.loaded.set(limit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });
  // 3. Cursor

  self.user = function() {
    if (self.username() == undefined && Meteor.user()) {
      return Meteor.user();
    } else if (self.username() !== undefined) {
      singleUser = Meteor.users.findOne({
        $or: [
          { username: self.userQuery.get() },
          { "profile.name": self.userQuery.get() }
        ]
      });
      console.log(singleUser);
      return singleUser;
    }
  };

  self.posts = function() {
    if (self.username() == undefined && Meteor.user()) {
      var authorPosts = Posts.find(self.query.get(), {
        sort: { submitted: -1, _id: -1 },
        limit: self.loaded.get()
      });
      return authorPosts;
    } else if (self.username() !== undefined) {
      var authorPosts = Posts.find(self.query.get(), {
        sort: { submitted: -1, _id: -1 },
        limit: self.loaded.get()
      });
      return authorPosts;
    }
  };
});
