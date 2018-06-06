import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Posts } from '/imports/api/posts/posts.js';
import { Comments } from '/imports/api/comments/comments.js';

import './post.html';

import {styles} from '/imports/startup/client/map_styles.js';

import '../../components/posts/post_single.js';
import '../../components/comments/comment_item.js';
import '../../components/comments/comment_submit.js';


Template.post.helpers({
  'post'() {
    var postSlug = FlowRouter.getParam('slug');
    if ( postSlug !== undefined ) {
      return Posts.findOne({ slug: postSlug });
    }
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
  }
});


Template.post.onCreated(function() {
  var postSlug = FlowRouter.getParam('slug');
  var self = this;
  self.autorun(function() {
    if ( postSlug !== undefined ) {
      self.subscribe('singlePost', postSlug);
      self.subscribe('comments', postSlug);
    }
  });

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

      var markers = {};

      Posts.find().observe({

          added: function(document) {
              var place = document;
              var titulo = place.title;
              var direccion = place.address;
              var categoria = place.category;
              var descripcion = place.description;
              var contentString = '<div class="infowindow open">' + '<h4>' + titulo + '</h4>' + '<p class="text-muted address mb-2">' + direccion + '</p><p class="description">' + descripcion + '</p>' + '</div>';

              // Create a marker for this document
              var marker = new google.maps.Marker({
                  draggable: false,
                  animation: google.maps.Animation.DROP,
                  position: new google.maps.LatLng(document.location[0], document.location[1]),
                  map: map.instance,
                  icon: icons[place.icon],
                  optimized: false,
                  // We store the document _id on the marker in order
                  // to update the document within the 'dragend' event below.
                  id: document._id
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
              /*
                google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map.instance, marker);
                if (currentPlace == marker) {
                  currentPlace = null;
                  infowindow.close();
                } else {
                  currentPlace = marker;
                }
              });*/
              // Store this marker instance within the markers object.
              markers[document._id] = marker;
          },
          changed: function(newDocument, oldDocument) {
              var currentPlace = null;
              var place = newDocument;
              var newLatlng = new google.maps.LatLng(place.location[0], place.location[1]);
              var titulo = place.title;
              var direccion = place.address;
              var categoria = place.category;
              var descripcion = place.description;
              var contentString = '<div class="infowindow open">' + '<h4>' + titulo + '</h4>' + '<p class="address">' + direccion + '</p><p class="desc">' + descripcion + '</p>' + '<a href="#detail" data-router="section">Ampliar</a></div>';
              var infowindow = new google.maps.InfoWindow({
                  content: contentString,
                  maxWidth: 300,
                  minHeight: 100
              });
              var marker = markers[newDocument._id];
              /*
                      google.maps.event.addListener(marker, 'position_changed', function() {
                      infowindow.open(map.instance, marker);
                      if (currentPlace == marker) {
                        currentPlace = null;
                        infowindow.close();
                      } else {
                        currentPlace = marker;
                      }
                    }); */
              // Store this marker instance within the markers object.

              console.log(newLatlng);
              markers[newDocument._id].setPosition(newLatlng);
          },
          removed: function(oldDocument) {
              // Remove the marker from the map
              markers[oldDocument._id].setMap(null);

              // Clear the event listener
              google.maps.event.clearInstanceListeners(
                  markers[oldDocument._id]);

              // Remove the reference to this marker instance
              delete markers[oldDocument._id];
          }
      });

  });

});

Template.post.onRendered(function() {
  GoogleMaps.load({key: 'AIzaSyDKcZBwYBkYJx6-GJI1OZjPPOmA40R1fV4'});
});
