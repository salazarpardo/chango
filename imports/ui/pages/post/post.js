import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Posts } from "/imports/api/posts/posts.js";
import { subs } from "/imports/api/posts/posts.js";
import { Comments } from "/imports/api/comments/comments.js";
import { Meteor } from "meteor/meteor";

var googleMapsApiKey = Meteor.settings.public.GoogleMaps;

import "./post.html";

import "../../components/posts/post_single.js";
import "../../components/posts/posts_list.js";
import "../../components/posts/post_map.js";
import "../../components/comments/comment_item.js";
import "../../components/comments/comment_submit.js";
import "../../components/skeleton/skeleton.js";

Template.post.helpers({
  post() {
    return Template.instance().post();
  },
  comments() {
    var postSlug = FlowRouter.getParam("slug");
    if (postSlug !== undefined) {
      return Comments.find({ postSlug: postSlug });
    }
  },
  location() {
    var post = Template.instance().post();
    if (GoogleMaps.loaded()) {
      var postLocation = new google.maps.LatLng(
        post.location[0],
        post.location[1]
      );
      if (postLocation == "(0, NaN)") {
        return false;
      }
      return postLocation;
    }
  },
  postReady() {
    if (subs.ready()) {
      return true;
    }
  },
  posts() {
    return Template.instance().posts();
  },
  hasMorePosts() {
    return false;
  }
});

Template.post.onCreated(function() {
  var self = this;

  // 1. Initialization

  // initialize the reactive variables
  self.loaded = new ReactiveVar(0);
  self.limit = new ReactiveVar(3);
  self.sortby = new ReactiveVar({ submitted: -1, _id: -1 });
  self.query = new ReactiveVar({});
  self.postSlug = () => FlowRouter.getParam("slug");

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  self.autorun(() => {
    FlowRouter.watchPathChange();
    if (self.postSlug() !== undefined) {
      subs.subscribe("singlePost", self.postSlug());
      self.subscribe("comments", self.postSlug());
    }

    self.post = function() {
      if (self.postSlug() !== undefined) {
        singlePost = Posts.findOne({ slug: self.postSlug() });
        return singlePost;
      }
    };
    if (subs.ready()) {
      Session.set("documentTitle", self.post().title + " | Chango");
    }

    // get the limit and sort
    var limit = self.limit.get();
    var sortby = self.sortby.get();
    var query = self.query.get();

    // subscribe to the posts publication
    var subscription = subs.subscribe("posts", sortby, limit, query);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      self.loaded.set(limit);
    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  self.posts = function() {
    return Posts.find(self.query.get(), {
      sort: self.sortby.get(),
      limit: self.loaded.get()
    });
  };
});

Template.post.onRendered(function() {
  GoogleMaps.load({ key: googleMapsApiKey });
});
