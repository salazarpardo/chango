import { Posts } from '/imports/api/posts/posts.js';

import './map.html';

// import '../../components/hello/hello.js';
// import '../../components/info/info.js';
import '../../components/posts/posts_list.js';


Template.map.helpers({
  'exampleMapOptions'() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
          center: new google.maps.LatLng(4.64205602, -74.11377526),
          zoom: 12,
          mapTypeControl: false
      };
    }
  }
});

Template.map.onRendered(function() {
  GoogleMaps.load({key: 'AIzaSyDKcZBwYBkYJx6-GJI1OZjPPOmA40R1fV4'});
});

Template.map.onCreated(function() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', function(map) {

        var icons = {
            'Chango': new google.maps.MarkerImage('/markers/marker-chango.svg', null, null, null, new google.maps.Size(50, 50)),
            'Usr': new google.maps.MarkerImage('/markers/marker-usr.svg', null, null, null, new google.maps.Size(50, 50))
        };

        var infowindow = new google.maps.InfoWindow({
            // content : contentString,
            maxWidth: 300,
            minHeight: 100
        });

        var initialLocation;
        var bogota = new google.maps.LatLng(4.60063716865005, -74.08990859985352);
        var browserSupportFlag = new Boolean();

        if (navigator.geolocation) {
            browserSupportFlag = true;
            navigator.geolocation.getCurrentPosition(function(position) {
                initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var loc1 = new google.maps.Marker({
                    position: initialLocation,
                    map: map.instance,
                    draggable: false,
                    title: "Usted esta aqu\u00ed",
                    icon: icons['Usr'],
                    optimized: false,
                    zIndex: 100
                });

                var contentStringDetail = '<div class="infowindow feature open">' + '<h4>Usted esta aquí</h4>' + '</div>';
                /* var infowindowDetail = new google.maps.InfoWindow({
                content : contentStringDetail
                }); */
                var currentPlace = null;
                google.maps.event.addListener(loc1, 'click', function() {
                    infowindow.open(map.instance, loc1);
                    infowindow.setContent(contentStringDetail);
                    if (currentPlace == loc1) {
                        currentPlace = null;
                        infowindow.close();
                    } else {
                        currentPlace = loc1;
                    }
                });
                map.instance.setCenter(initialLocation);

            }, function() {
                handleNoGeolocation(browserSupportFlag);
            });
        } else {
            browserSupportFlag = false;
            handleNoGeolocation(browserSupportFlag);
        };

        function handleNoGeolocation(errorFlag) {
            if (errorFlag == true) {
                alert("El servicio de Localizaci\u00f3n no esta activo.");
                initialLocation = bogota;
            } else {
                alert("Su navegador no soporta el servicio de Localizaci\u00f3n.");
                initialLocation = bogota;
            }
            map.instance.setCenter(initialLocation);

        };

        var markers = {};

        Posts.find().observe({

            added: function(document) {
                var place = document;
                var titulo = place.title;
                var direccion = place.address;
                var categoria = place.category;
                var descripcion = place.description;
                var contentString = '<div class="infowindow open">' + '<h4>' + titulo + '</h4>' + '<p class="address">' + direccion + '</p><p class="desc">' + descripcion + '</p>' + '<a href="#detail" data-router="section">Ampliar</a></div>';

                // Create a marker for this document
                var marker = new google.maps.Marker({
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(document.location[0], document.location[1]),
                    map: map.instance,
                    icon: icons['Chango'],
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
                var newLatlng = new google.maps.LatLng(place.position[0], place.position[1]);
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
