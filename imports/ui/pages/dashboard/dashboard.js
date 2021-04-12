import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Posts } from "/imports/api/posts/posts.js";
import { subs } from "/imports/api/posts/posts.js";
import { Comments } from "/imports/api/comments/comments.js";
import { Meteor } from "meteor/meteor";

import "./dashboard.html";

import "../../components/posts/posts_list.js";
import "../../components/comments/comment_item.js";

Template.dashboard.onCreated(function() {
  // 1. Initialization

  var instance = this;

  instance.subscribe("userComments");
  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(5);
  instance.query = new ReactiveVar({});

  instance.sortRecent = new ReactiveVar({ submitted: -1, _id: -1 });
  instance.sortVoted = new ReactiveVar({
    votes: -1,
    commentsCount: -1,
    submitted: -1,
    _id: -1
  });
  instance.sortCommented = new ReactiveVar({
    commentsCount: -1,
    votes: -1,
    submitted: -1,
    _id: -1
  });

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  instance.autorun(function() {
    // get the limit and sort
    var limit = instance.limit.get();
    var sortRecent = instance.sortRecent.get();
    var sortVoted = instance.sortVoted.get();
    var sortCommented = instance.sortCommented.get();
    var query = instance.query.get();

    // subscribe to the posts publication
    var recentSubscription = subs.subscribe("posts", sortRecent, limit, query);
    var votedSubscription = subs.subscribe("posts", sortVoted, limit, query);
    var commentedSubscription = subs.subscribe(
      "posts",
      sortCommented,
      limit,
      query
    );

    // if subscription is ready, set limit to newLimit
    if (instance.subscriptionsReady()) {
      console.log("> Received " + limit + " posts. \n\n");
      instance.loaded.set(limit);
    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.recentPosts = function() {
    return Posts.find(
      {},
      {
        sort: instance.sortRecent.get(),
        limit: instance.loaded.get()
      }
    );
  };
  instance.bestPosts = function() {
    return Posts.find(
      {},
      {
        sort: instance.sortVoted.get(),
        limit: instance.loaded.get()
      }
    );
  };
  instance.commentedPosts = function() {
    return Posts.find(
      {},
      {
        sort: instance.sortCommented.get(),
        limit: instance.loaded.get()
      }
    );
  };
  instance.userComments = function() {
    return Comments.find(
      {},
      { sort: { submitted: -1 }, limit: instance.loaded.get() }
    );
  };
});

Template.dashboard.helpers({
  comments() {
    return Template.instance().userComments();
  },
  commentsCount() {
    return Template.instance()
      .userComments()
      .count();
  },
  posts() {
    return Template.instance().recentPosts();
  },
  postsCount() {
    return Template.instance()
      .recentPosts()
      .count();
  },
  bestPosts() {
    return Template.instance().bestPosts();
  },
  bestPostsCount() {
    return Template.instance()
      .bestPosts()
      .count();
  },
  commentedPosts() {
    return Template.instance().commentedPosts();
  },
  commentedPostsCount() {
    return Template.instance()
      .commentedPosts()
      .count();
  },
  hasMorePosts() {
    return false;
  }
});
