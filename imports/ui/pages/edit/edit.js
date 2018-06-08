import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Posts } from '/imports/api/posts/posts.js';

import './edit.html';

import {styles} from '/imports/startup/client/map_styles.js';

Template.postEdit.onCreated(function() {
    Session.set('postEditErrors', {});

    var postSlug = FlowRouter.getParam('slug');
    var self = this;
    self.autorun(function() {
      if ( postSlug !== undefined ) {
        self.subscribe('singlePost', postSlug);
      }
    });

    GoogleMaps.ready('modalMap', function(map) {
          var icons = {
              'Chango': new google.maps.MarkerImage('/markers/marker-chango.svg', null, null, null, new google.maps.Size(40, 40), new google.maps.Point(0, 0), new google.maps.Point(0, 0)),
              'Usr': new google.maps.MarkerImage('/markers/marker-usr.svg', null, null, null, new google.maps.Size(40, 40), new google.maps.Point(0, 0), new google.maps.Point(0, 0))
          }
          var marker, oldLocation, newLocation;

          var post = Posts.findOne({ slug: postSlug });
          var postLocation = new google.maps.LatLng(post.location[0], post.location[1]);
          // Create a marker for this document
          marker = new google.maps.Marker({
              draggable: true,
              animation: google.maps.Animation.DROP,
              position: postLocation,
              map: map.instance,
              icon: icons['Chango'],
              shadow: icons['Shadow'],
              optimized: false,
              // We store the document _id on the marker in order
              // to update the document within the 'dragend' event below.
              id: document._id
          });
          var geocoder = new google.maps.Geocoder();

          function codeLatLng() {
              var input = $("#exampleInputLocation").val();
              var latlngStr = input.split(',', 2);
              var latlng = new google.maps.LatLng(latlngStr[0], latlngStr[1]);
              geocoder.geocode({
                  'location': latlng
              }, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                      if (results[1]) {
                          $("#exampleInputAddress").val(results[1].formatted_address);

                      } else {
                          window.alert('No results found');
                      }
                  } else {
                      window.alert('Geocoder failed due to: ' + status);
                  }
              });
          }

          google.maps.event.addListener(map.instance, 'click', function(event) {
              if (!marker) {
                  marker = new google.maps.Marker({
                      draggable: true,
                      animation: google.maps.Animation.DROP,
                      position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()),
                      map: map.instance,
                      icon: icons['Chango'],
                      shadow: icons['Shadow']
                  });
              } else {
                  marker.setPosition(event.latLng);
              }

              google.maps.event.addListener(marker, 'dragend', function(event) {
                  newLocation = event.latLng.lat() + "," + event.latLng.lng();
                  $("#exampleInputLocation").val(newLocation);
                  codeLatLng();
              });
          });
      });
});

Template.postEdit.onRendered(function () {
  GoogleMaps.load({key: 'AIzaSyDKcZBwYBkYJx6-GJI1OZjPPOmA40R1fV4'});
});

Template.postEdit.helpers({
  'post'() {
    var postSlug = FlowRouter.getParam('slug');
    if ( postSlug !== undefined ) {
      return Posts.findOne({ slug: postSlug });
    }
  },
  'errorMessage'(field) {
    return Session.get('postEditErrors')[field];
  },
  'errorClass'(field) {
    return !!Session.get('postEditErrors')[field] ? 'is-invalid' : '';
  },
  'mapOptions'() {
    var postSlug = FlowRouter.getParam('slug');
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      var bogota = new google.maps.LatLng(4.710249429547743,-74.07099918512495);
      var post = Posts.findOne({ slug: postSlug });
      var postLocation = new google.maps.LatLng(post.location[0], post.location[1]);

      // Map initialization options
      return {
          center: postLocation || bogota,
          zoom: 14,
          mapTypeControl: false,
          styles: styles
      };
    }
  },
});

Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;

    var postProperties = {
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val(),
      category: $(e.target).find('[name=category]').val(),
      location: $(e.target).find('[name=location]').val().split(','),
      address: $(e.target).find('[name=address]').val()
    }

    var errors = validatePost(postProperties);
    if (errors.title)
      return Session.set('postEditErrors', errors);

    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason, 'alert-danger');
      } else {
        FlowRouter.go('post', {slug: FlowRouter.getParam('slug')});
      }
    });
  },
  'click .confirm': function(e) {
    e.preventDefault();
    Session.set('currentPostId', this._id);
    $('#confirmModal').modal('show');
    // FlowRouter.go('home');
  },
  'click .delete': function(e) {
    e.preventDefault();
    var currentPostId = Session.get('currentPostId');;
    Posts.remove(currentPostId);
    $('#confirmModal')
        .on('hidden.bs.modal', function() {
          FlowRouter.go('dashboard');
        })
        .modal('hide');

  }
});
