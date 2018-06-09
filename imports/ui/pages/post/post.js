import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Posts } from '/imports/api/posts/posts.js';
import { subs } from '/imports/api/posts/posts.js';
import { Comments } from '/imports/api/comments/comments.js';

import './post.html';

import {styles} from '/imports/startup/client/map_styles.js';

import '../../components/posts/post_single.js';
import '../../components/comments/comment_item.js';
import '../../components/comments/comment_submit.js';


Template.post.helpers({
  'post'() {
    return Template.instance().post();
  },
  'comments'() {
    var postSlug = FlowRouter.getParam('slug');
    if ( postSlug !== undefined ) {
      return Comments.find({postSlug: postSlug });
    }
  },
  'location'() {
    var postSlug = FlowRouter.getParam('slug');
    var post = Posts.findOne({ slug: postSlug });
    if (GoogleMaps.loaded()) {
      var postLocation = new google.maps.LatLng(post.location[0], post.location[1]);
      if (postLocation == "(0, NaN)") {
        return false
      }
      return postLocation;
    }
  },
  'exampleMapOptions'() {
    var postSlug = FlowRouter.getParam('slug');
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      var bogota = new google.maps.LatLng(4.710249429547743,-74.07099918512495);
      var post = Posts.findOne({ slug: postSlug });
      var postLocation = new google.maps.LatLng(post.location[0], post.location[1]);

      // Map initialization options
      return {
          center: postLocation || bogota,
          zoom: 15,
          mapTypeControl: false,
          styles: styles
      };
    }
  },
  'postReady'() {
    if(subs.ready()) {
     return true;
    }
  }
});


Template.post.onCreated(function() {

  var postSlug = FlowRouter.getParam('slug');
  var self = this;
  self.autorun(function() {
    FlowRouter.watchPathChange();
    if ( postSlug !== undefined ) {
      subs.subscribe('singlePost', postSlug);
      self.subscribe('comments', postSlug);
    }
  });
  self.post = function() {
    if ( postSlug !== undefined ) {
      return Posts.findOne({ slug: postSlug });
    }
  }


  self.markers;

  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {

      var icons = {
        0: new google.maps.MarkerImage('/markers/marker-chango.svg', null, null, null, new google.maps.Size(50, 50)),
        1: new google.maps.MarkerImage('/markers/marker-chango-b.svg', null, null, null, new google.maps.Size(50, 50)),
        2: new google.maps.MarkerImage('/markers/marker-chango-o.svg', null, null, null, new google.maps.Size(50, 50)),
        3: new google.maps.MarkerImage('/markers/marker-chango-g.svg', null, null, null, new google.maps.Size(50, 50)),
        4: new google.maps.MarkerImage('/markers/marker-chango-p.svg', null, null, null, new google.maps.Size(50, 50)),
        5: new google.maps.MarkerImage('/markers/marker-chango-db.svg', null, null, null, new google.maps.Size(50, 50)),
        'Usr': new google.maps.MarkerImage('/markers/marker-usr.svg', null, null, null, new google.maps.Size(50, 50))
      };

      var infowindow = new google.maps.InfoWindow({
          // content : contentString,
          maxWidth: 300,
          minHeight: 100
      });

      var place = self.post();
      var titulo = place.title;
      var direccion = place.address;
      var categoria = place.category;
      var descripcion = place.description;
      var icon = place.icon;
      var contentString = '<div class="infowindow open">' + '<h4 class="mb-1 cat-' + icon + '">' + titulo + '</h4>' + '<p class="text-muted address mb-2">' + direccion + '</p>' + '</div>';

      // Create a marker for this document
      var marker = new google.maps.Marker({
          draggable: false,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(place.location[0], place.location[1]),
          map: map.instance,
          icon: icons[place.icon],
          optimized: false,
          // We store the document _id on the marker in order
          // to update the document within the 'dragend' event below.
          id: place._id
      });

      var currentPlace = null;

      google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(contentString);
          infowindow.open(map.instance, this);
          if (currentPlace == marker) {
              currentPlace = null;
              infowindow.close();
          } else {
              currentPlace = marker;
          }
      });

  });

});

Template.post.onRendered(function() {
  GoogleMaps.load({key: 'AIzaSyDKcZBwYBkYJx6-GJI1OZjPPOmA40R1fV4'});
});
