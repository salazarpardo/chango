import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Match } from "meteor/check";

import { Posts } from "/imports/api/posts/posts.js";
import { Meteor } from "meteor/meteor";

import { styles } from "/imports/startup/client/map_styles.js";

import * as linkify from "linkifyjs";
import linkifyStr from "linkifyjs/string";
import hashtag from "linkifyjs/plugins/hashtag"; // optional
import mention from "linkifyjs/plugins/mention"; // optional

hashtag(linkify);
mention(linkify);

import "./submit.html";

Template.submit.onCreated(function() {
  Session.set("category", 0);
  Session.set("postSubmitErrors", {});
  self = this;
  GoogleMaps.ready("modalMap", function(map) {
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

    self.marker = "";

    var newLocation;

    var geocoder = new google.maps.Geocoder();

    function codeLatLng() {
      var input = $("#exampleInputLocation").val();
      var latlngStr = input.split(",", 2);
      var latlng = new google.maps.LatLng(latlngStr[0], latlngStr[1]);
      geocoder.geocode(
        {
          location: latlng
        },
        function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              $("#exampleInputAddress").val(results[1].formatted_address);
            } else {
              window.alert("No results found");
            }
          } else {
            window.alert("Geocoder failed due to: " + status);
          }
        }
      );
    }

    google.maps.event.addListener(map.instance, "click", function(event) {
      if (!self.marker) {
        self.marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(
            event.latLng.lat(),
            event.latLng.lng()
          ),
          map: map.instance,
          icon: self.icons[Session.get("category")]
        });
      } else {
        self.marker.setPosition(event.latLng);
        self.marker.setIcon(self.icons[Session.get("category")]);
      }

      google.maps.event.addListener(self.marker, "dragend", function(event) {
        newLocation = event.latLng.lat() + "," + event.latLng.lng();
        $("#exampleInputLocation").val(newLocation);
        codeLatLng();
      });

      newLocation = event.latLng.lat() + "," + event.latLng.lng();
      $("#exampleInputLocation").val(newLocation);
      codeLatLng();
    });
  });
});

Template.submit.onRendered(function() {
  // Emulating placeholder behaviour on select dropdowns.
  if ($("select").length) {
    $.each($("select"), function(i, val) {
      var $el = $(val);

      if (!$el.val()) {
        $el.addClass("not-chosen");
      }

      $el.on("change", function() {
        if (!$el.val()) $el.addClass("not-chosen");
        else $el.removeClass("not-chosen");
      });
    });
  }
});

Template.submit.helpers({
  currentUrl() {
    return window.location.origin;
  },
  errorMessage(field) {
    return Session.get("postSubmitErrors")[field];
  },
  errorClass(field) {
    return !!Session.get("postSubmitErrors")[field] ? "is-invalid" : "";
  },
  mapOptions() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      var bogota = new google.maps.LatLng(
        4.710249429547743,
        -74.07099918512495
      );
      // Map initialization options
      return {
        center: bogota,
        zoom: 12,
        mapTypeControl: false,
        styles: styles
      };
    }
  }
});

Template.submit.events({
  'blur [name="title"]'() {
    var form = $("#add-post"),
      title = form.find("[name='title']"),
      slug = form.find("[name='slug']");
    var isValid = title[0].validity.valid;
    if (isValid) {
      var formatted = formatSlug(title.val());
      slug.val(formatted);
    } else {
      slug.val("");
    }
  },
  "submit form"(e) {
    e.preventDefault();
    var str = $(e.target)
      .find("[name=description]")
      .val();
    var options = {
      formatHref: {
        hashtag: val => "/tag/" + val.substr(1),
        mention: val => "/u" + val
      }
    };
    var linkedText = linkifyStr(str, options);
    var tags = linkify.find(str, "hashtag");
    var mentions = linkify.find(str, "mention");

    var post = {
      title: $(e.target)
        .find("[name=title]")
        .val(),
      slug: $(e.target)
        .find("[name=slug]")
        .val(),
      description: str,
      text: linkedText,
      tags: tags,
      mentions: mentions,
      category: $(e.target)
        .find("[name=category]")
        .val(),
      location: $(e.target)
        .find("[name=location]")
        .val()
        .split(","),
      address: $(e.target)
        .find("[name=address]")
        .val(),
      icon: Session.get("category")
    };

    var errors = validatePost(post);
    if (errors.title || errors.description || errors.location) {
      return Session.set("postSubmitErrors", errors);
    } else {
      Session.set("postSubmitErrors", errors);
    }

    Meteor.call("posts.insert", post, (error, result) => {
      if (error) {
        analytics.track("New Idea Error", post);
        return throwError(error.reason, "alert-danger");
      }
      if (result.postExists) {
        analytics.track("Idea with same URL", post);
        throwError(
          "Existe una idea con la misma ruta. Intenta de nuevo después de cambiarla.",
          "alert-info"
        );
      } else {
        analytics.track("Added New Idea", post);
        FlowRouter.go("post", { slug: result.slug });
      }
    });
  },
  'change [name="category"]'() {
    var marker = Template.instance().marker;
    Session.set("category", $("#exampleInputCategory").prop("selectedIndex"));
    if (marker) {
      marker.setIcon(self.icons[Session.get("category")]);
    }
  },
  "click .geoloc"(e) {
    $(".geoloc").toggleClass("active");
    $(".geoloc .svg-inline--fa").toggleClass(
      "fa-location-arrow fa-spinner fa-spin"
    );
    var map = GoogleMaps.maps.modalMap.instance;
    var icons = Template.instance().icons;
    var initialLocation;
    var browserSupportFlag = new Boolean();

    function locationSuccess(position) {
      Session.set("lat", position.coords.latitude);
      Session.set("long", position.coords.longitude);
      initialLocation = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      var loc1 = new google.maps.Marker({
        position: initialLocation,
        map: map,
        draggable: false,
        title: "Usted esta aqu\u00ed",
        icon: icons["Usr"],
        optimized: false,
        zIndex: 100
      });

      map.setCenter(initialLocation);
      map.setZoom(15);
      $(".geoloc").toggleClass("active");
      $(".geoloc .svg-inline--fa").toggleClass(
        "fa-location-arrow fa-spinner fa-spin"
      );
    }

    function locationError() {
      handleNoGeolocation(browserSupportFlag);
      $(".geoloc").toggleClass("active");
      $(".geoloc .svg-inline--fa").toggleClass(
        "fa-location-arrow fa-spinner fa-spin"
      );
    }

    var locationOptions = {
      maximumAge: 5 * 60 * 1000
    };

    if (navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(
        locationSuccess,
        locationError,
        locationOptions
      );
    } else {
      browserSupportFlag = false;
      handleNoGeolocation(browserSupportFlag);
    }

    function handleNoGeolocation(errorFlag) {
      if (errorFlag == true) {
        alert("El servicio de Localizaci\u00f3n no esta activo.");
      } else {
        alert("Su navegador no soporta el servicio de Localizaci\u00f3n.");
      }
    }
  }
});
