import { Posts } from '/imports/api/posts/posts.js';

import './map.html';

import {styles} from '/imports/startup/client/map_styles.js';

import '../../components/posts/posts_list.js';


Template.map.helpers({
  'exampleMapOptions': function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options

      var initialLocation;
      var bogota = new google.maps.LatLng(4.710249429547743,-74.07099918512495);
      if ((Session.get('lat') || Session.get('long')) == undefined) {
        initialLocation = bogota;
      } else {
        initialLocation = new google.maps.LatLng(Session.get('lat'), Session.get('long'));
      }

      return {
          center: initialLocation,
          zoom: 13,
          mapTypeControl: false,
          styles: styles
      };
    }
  }
});

Template.map.onRendered(function() {
  GoogleMaps.load({key: 'AIzaSyDKcZBwYBkYJx6-GJI1OZjPPOmA40R1fV4'});
});

Template.map.onCreated(function() {

    var self = this;

    self.that;
    self.currentPlace = null;

    var markers;
    var bounds, center;

    GoogleMaps.ready('exampleMap', function(map) {

        self.icons = {
          0: new google.maps.MarkerImage('/markers/marker-chango.svg', null, null, null, new google.maps.Size(50, 50)),
          1: new google.maps.MarkerImage('/markers/marker-chango-b.svg', null, null, null, new google.maps.Size(50, 50)),
          2: new google.maps.MarkerImage('/markers/marker-chango-o.svg', null, null, null, new google.maps.Size(50, 50)),
          3: new google.maps.MarkerImage('/markers/marker-chango-g.svg', null, null, null, new google.maps.Size(50, 50)),
          4: new google.maps.MarkerImage('/markers/marker-chango-p.svg', null, null, null, new google.maps.Size(50, 50)),
          5: new google.maps.MarkerImage('/markers/marker-chango-db.svg', null, null, null, new google.maps.Size(50, 50)),
          'Usr': new google.maps.MarkerImage('/markers/marker-usr.svg', null, null, null, new google.maps.Size(50, 50))
        };

        var that = self.that;
        var currentPlace = self.currentPlace;

        self.infowindow = new google.maps.InfoWindow({
            maxWidth: 300,
            minHeight: 100
        });

        markers = [];

        bounds = new google.maps.LatLngBounds();
        center = new google.maps.LatLng();

        Posts.find().observe({

            added: function(document) {
                var place = document;
                var title = place.title;
                var address = place.address;
                var category = place.category;
                var description = place.description;
                var slug = place.slug;
                var location = new google.maps.LatLng(document.location[0], document.location[1]);
                var contentString = '<div class="infowindow open">' + '<h4>' + title + '</h4>' + '<p class="address text-muted mb-2">' + address + '</p><p class="description">' + description + '</p>' + '<a href="/idea/' + slug + '">Ampliar</a></div>';

                // Create a marker for this document
                var marker = new google.maps.Marker({
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    position: location,
                    map: map.instance,
                    icon: self.icons[place.icon],
                    // optimized: false,
                    // We store the document _id on the marker in order
                    // to update the document within the 'dragend' event below.
                    id: document._id
                });

                var markerClick = function() {
                  if (that && that.id) {
                    that.setZIndex();
                  } else if (that) {
                    that.setZIndex(100);
                  }
                  that = this;
                  this.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
                  self.infowindow.setContent(contentString);
                  self.infowindow.open(map.instance, this);
                  if (currentPlace == this) {
                      currentPlace = null;
                      self.infowindow.close();
                  } else {
                      currentPlace = this;
                  }
                };

                self.infowindow.setContent(contentString);

                google.maps.event.addListener(marker, 'click', markerClick, {passive:true} );

                google.maps.event.addListener(marker, "mouseover", function() {
                  marker.setZIndex(999); //hover
                }, {passive:true});

                google.maps.event.addListener(marker, "mouseout", function() {
                  marker.setZIndex(undefined); //undo
                }, {passive:true});

                bounds.extend(location);

                center = location;

                // Store this marker instance within the markers object.
                markers[document._id] = marker;
                markers.length ++;

            },
            changed: function(newDocument, oldDocument) {
                var currentPlace = null;
                var place = newDocument;
                var newLatlng = new google.maps.LatLng(place.position[0], place.position[1]);
                var titulo = place.title;
                var direccion = place.address;
                var categoria = place.category;
                var descripcion = place.description;
                var contentString = '<div class="infowindow open">' + '<h4>' + titulo + '</h4>' + '<p class="address text-muted mb-2">' + direccion + '</p><p class="description">' + descripcion + '</p>' + '<a href="/idea/' + slug + '">Ampliar</a></div>';
                self.infowindow.setContent(contentString);
                var marker = markers[newDocument._id];

                bounds.extend(newLatlng);
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
        if (markers.length == 1){
          map.instance.setCenter(center);
        }
        else if (markers.length >= 2){
          map.instance.fitBounds(bounds);
        }
    });
});

Template.map.events({
  'click .geoloc': function(e) {
    $('.geoloc').toggleClass('active');
    $('.geoloc .svg-inline--fa').toggleClass('fa-location-arrow fa-spinner fa-spin');
    var map = GoogleMaps.maps.exampleMap.instance;
    var icons =  Template.instance().icons;
    var infowindow = Template.instance().infowindow;
    var that = Template.instance().that;
    var currentPlace = Template.instance().currentPlace;
    var initialLocation;
    var browserSupportFlag = new Boolean();

    function locationSuccess(position) {
        Session.set('lat', position.coords.latitude);
        Session.set('long', position.coords.longitude);
        initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var loc1 = new google.maps.Marker({
            position: initialLocation,
            map: map,
            draggable: false,
            title: "Usted esta aqu\u00ed",
            icon: icons['Usr'],
            optimized: false,
            zIndex: 100,
        });

        var contentStringUser =
          '<div class="infowindow feature open">' +
            '<h4>Usted esta aquí</h4>' +
          '</div>';

        var markerClick = function() {
          if (that) {
            that.setZIndex();
          }
          that = this;
          this.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
          infowindow.setContent(contentStringUser);
          infowindow.open(map.instance, this);
          if (currentPlace == this) {
              currentPlace = null;
              infowindow.close();
          } else {
              currentPlace = this;
          }
        };

        google.maps.event.addListener(loc1, 'click', markerClick, {passive: true});

        map.setCenter(initialLocation);
        map.setZoom(15)
        $('.geoloc').toggleClass('active');
        $('.geoloc .svg-inline--fa').toggleClass('fa-location-arrow fa-spinner fa-spin');

    }

    function locationError() {
        handleNoGeolocation(browserSupportFlag);
        $('.geoloc').toggleClass('active');
        $('.geoloc .svg-inline--fa').toggleClass('fa-location-arrow fa-spinner fa-spin');
    }

    var locationOptions = {
      maximumAge: 5 * 60 * 1000,
    }

    if (navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
    } else {
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    };

    function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {
            alert("El servicio de Localizaci\u00f3n no esta activo.");
        } else {
            alert("Su navegador no soporta el servicio de Localizaci\u00f3n.");
        }
    };
  }
});
