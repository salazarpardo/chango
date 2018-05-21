import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Posts } from '/imports/api/posts/posts.js';
import { Meteor } from 'meteor/meteor';

import './posts_list.html';

import './post_item.js';

Template.postsList.onCreated(function () {

  // 1. Initialization

  var instance = this;

  instance.subscribe('notifications');

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(5);
  instance.sortby = new ReactiveVar({submitted: -1, _id: -1});

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  instance.autorun(function () {
    FlowRouter.watchPathChange();
    if (FlowRouter.current().path == '/best') {
      instance.sortby.set({votes: -1, submitted: -1, _id: -1});
    } else if (FlowRouter.current().path == '/map') {
      instance.sortby.set({location: -1, submitted: -1, _id: -1});
    } else {
      instance.sortby.set({submitted: -1, _id: -1});
    }
    console.log(instance.sortby);
    // get the limit and sort
    var limit = instance.limit.get();
    var sortby = instance.sortby.get();

    // subscribe to the posts publication
    var subscription = instance.subscribe('posts', sortby, limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received "+limit+" posts. \n\n")
      instance.loaded.set(limit);
    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.posts = function() {
    return Posts.find({}, {sort: instance.sortby.get(), limit: instance.loaded.get()});
  }

});

Template.postsList.onRendered(function () {
  this.find('.wrapper')._uihooks = {
    insertElement: function (node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    },
    moveElement: function (node, next) {
      var $node = $(node), $next = $(next);
      var oldTop = $node.offset().top;
      var height = $node.outerHeight(true);

      // find all the elements between next and node
      var $inBetween = $next.nextUntil(node);
      if ($inBetween.length === 0)
        $inBetween = $node.nextUntil(next);

      // now put node in place
      $node.insertBefore(next);

      // measure new top
      var newTop = $node.offset().top;

      // move node *back* to where it was before
      $node
        .removeClass('animate')
        .css('top', oldTop - newTop);

      // push every other element down (or up) to put them back
      $inBetween
        .removeClass('animate')
        .css('top', oldTop < newTop ? height : -1 * height)


      // force a redraw
      $node.offset();

      // reset everything to 0, animated
      $node.addClass('animate').css('top', 0);
      $inBetween.addClass('animate').css('top', 0);
    },
    removeElement: function(node) {
      $(node).fadeOut(function() {
        $(this).remove();
      });
    }
  }
});

Template.postsList.helpers({
  // the posts cursor
  posts: function () {
    return Template.instance().posts();
  },
  // are there more posts to show?
  hasMorePosts: function () {
    return Template.instance().posts().count() >= Template.instance().limit.get();
  }
});

Template.postsList.events({
  'submit .info-post-add'(event) {
    event.preventDefault();

    const target = event.target;
    const title = target.title;
    const url = target.url;

    Meteor.call('posts.insert', title.value, url.value, (error) => {
      if (error) {
        alert(error.error);
      } else {
        title.value = '';
        url.value = '';
      }
    });
  },
  'click .load-more': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += 5;
    instance.limit.set(limit);
  }
});
