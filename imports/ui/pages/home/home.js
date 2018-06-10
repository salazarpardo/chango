import { Posts } from '/imports/api/posts/posts.js';
import { subs } from '/imports/api/posts/posts.js';

import './home.html';

import '../../components/posts/posts_list.js';

Template.home.onCreated(function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(5);
  instance.sortby = new ReactiveVar({submitted: -1, _id: -1});

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  instance.autorun(function () {
    // get the limit and sort
    var limit = instance.limit.get();
    var sortby = instance.sortby.get();

    // subscribe to the posts publication
    var subscription = subs.subscribe('posts', sortby, limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      instance.loaded.set(limit);
    } else {
      // console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.posts = function() {
    return Posts.find({}, {sort: {submitted: -1, _id: -1}, limit: instance.loaded.get()});
  }

});

Template.home.helpers({
  'posts'() {
    return Template.instance().posts();
  },
  'hasMorePosts'() {
    return false;
  },
});
