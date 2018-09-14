import "./post_map.html";

import { styles } from "/imports/startup/client/map_styles.js";

var MAP_ZOOM = 15;

Template.postMap.helpers({
  post() {
    return Template.currentData().post;
  },
  exampleMapOptions() {
    // Make sure the maps API has loaded
    var post = this;
    if (GoogleMaps.loaded()) {
      var bogota = new google.maps.LatLng(
        4.710249429547743,
        -74.07099918512495
      );
      var postLocation = new google.maps.LatLng(
        post.location[0],
        post.location[1]
      );

      // Map initialization options
      return {
        center: postLocation || bogota,
        zoom: MAP_ZOOM,
        mapTypeControl: false,
        styles: styles
      };
    }
  }
});

Template.postMap.onCreated(function() {
  var self = this;

  GoogleMaps.ready("exampleMap", function(map) {
    var marker, place;
    self.icons = {
      0: new google.maps.MarkerImage(
        "/markers/marker-chango.svg",
        null,
        null,
        null,
        new google.maps.Size(50, 50)
      ),
      1: new google.maps.MarkerImage(
        "/markers/marker-chango-b.svg",
        null,
        null,
        null,
        new google.maps.Size(50, 50)
      ),
      2: new google.maps.MarkerImage(
        "/markers/marker-chango-o.svg",
        null,
        null,
        null,
        new google.maps.Size(50, 50)
      ),
      3: new google.maps.MarkerImage(
        "/markers/marker-chango-g.svg",
        null,
        null,
        null,
        new google.maps.Size(50, 50)
      ),
      4: new google.maps.MarkerImage(
        "/markers/marker-chango-p.svg",
        null,
        null,
        null,
        new google.maps.Size(50, 50)
      ),
      5: new google.maps.MarkerImage(
        "/markers/marker-chango-db.svg",
        null,
        null,
        null,
        new google.maps.Size(50, 50)
      ),
      Usr: new google.maps.MarkerImage(
        "/markers/marker-usr.svg",
        null,
        null,
        null,
        new google.maps.Size(50, 50)
      )
    };

    self.infowindow = new google.maps.InfoWindow({
      maxWidth: 300,
      minHeight: 100
    });

    // Create and move the marker when latLng changes.
    self.autorun(function() {
      place = Template.currentData().post;

      var title = place.title;
      var address = place.address;
      var category = place.category;
      var description = place.description;
      var slug = place.slug;
      var icon = place.icon;
      var location = new google.maps.LatLng(
        place.location[0],
        place.location[1]
      );
      var contentString =
        '<div class="infowindow">' +
        '<h4 class="cat-' +
        icon +
        ' mb-1">' +
        title +
        "</h4>" +
        '<p class="category text-muted mb-2"><small><em>' +
        category +
        "</em></small></p>" +
        '<p class="description">' +
        description +
        "</p>" +
        '<p class="address text-muted mb-2">' +
        address +
        "</p>" +
        '<a href="/idea/' +
        slug +
        '"><em>Ampliar</em></a>' +
        "</div>";

      if (!location) return;

      // If the marker doesn't yet exist, create it.
      if (!marker) {
        marker = new google.maps.Marker({
          draggable: false,
          animation: google.maps.Animation.DROP,
          position: map.options.center,
          map: map.instance,
          icon: self.icons[icon],
          // optimized: false,
          // We store the document _id on the marker in order
          // to update the document within the 'dragend' event below.
          id: place._id
        });
      }
      // The marker already exists, so we'll just change its position.
      else {
        marker.setPosition(location);
        marker.setIcon(self.icons[icon]);
      }

      var markerClick = function() {
        self.infowindow.setContent(contentString);
        self.infowindow.open(map.instance, this);
      };

      self.infowindow.setContent(contentString);

      google.maps.event.addListener(marker, "click", markerClick, {
        passive: true
      });

      // Center and zoom the map view onto the current position.
      map.instance.setCenter(marker.getPosition());
      map.instance.setZoom(MAP_ZOOM);
    });
  });
});
