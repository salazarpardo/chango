import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Posts } from "/imports/api/posts/posts.js";

import * as linkify from "linkifyjs";
import linkifyStr from "linkifyjs/string";
import hashtag from "linkifyjs/plugins/hashtag"; // optional
import mention from "linkifyjs/plugins/mention"; // optional

hashtag(linkify);
mention(linkify);

import "./edit.html";

import { styles } from "/imports/startup/client/map_styles.js";

Template.postEdit.onCreated(function() {
  Session.set("postEditErrors", {});

  var postSlug = FlowRouter.getParam("slug");
  self = this;
  self.autorun(function() {
    if (postSlug !== undefined) {
      self.subscribe("singlePost", postSlug);
    }
  });

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
      )
    };

    self.marker = "";

    var oldLocation, newLocation;

    var post = Posts.findOne({ slug: postSlug });

    $("#exampleInputCategory").prop("selectedIndex", post.icon);
    Session.set("category", post.icon);

    var postLocation = new google.maps.LatLng(
      post.location[0],
      post.location[1]
    );
    // Create a marker for this document
    self.marker = new google.maps.Marker({
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: postLocation,
      map: map.instance,
      icon: self.icons[post.icon],
      optimized: false,
      // We store the document _id on the marker in order
      // to update the document within the 'dragend' event below.
      id: document._id
    });
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

Template.postEdit.onRendered(function() {
  GoogleMaps.load({ key: "AIzaSyDKcZBwYBkYJx6-GJI1OZjPPOmA40R1fV4" });
});

Template.postEdit.helpers({
  post() {
    var postSlug = FlowRouter.getParam("slug");
    if (postSlug !== undefined) {
      return Posts.findOne({ slug: postSlug });
    }
  },
  errorMessage(field) {
    return Session.get("postEditErrors")[field];
  },
  errorClass(field) {
    return !!Session.get("postEditErrors")[field] ? "is-invalid" : "";
  },
  mapOptions() {
    var postSlug = FlowRouter.getParam("slug");
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      var bogota = new google.maps.LatLng(
        4.710249429547743,
        -74.07099918512495
      );
      var post = Posts.findOne({ slug: postSlug });
      var postLocation = new google.maps.LatLng(
        post.location[0],
        post.location[1]
      );

      // Map initialization options
      return {
        center: postLocation || bogota,
        zoom: 14,
        mapTypeControl: false,
        styles: styles
      };
    }
  }
});

Template.postEdit.events({
  "submit form": function(e) {
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
    var currentPostId = this._id;

    var postProperties = {
      title: $(e.target)
        .find("[name=title]")
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

    var errors = validatePost(postProperties);
    if (errors.title) return Session.set("postEditErrors", errors);

    Posts.update(currentPostId, { $set: postProperties }, function(error) {
      if (error) {
        // display the error to the user
        analytics.track("Error Editing Idea", postProperties);
        throwError(error.reason, "alert-danger");
      } else {
        analytics.track("Edited Idea", postProperties);
        FlowRouter.go("post", { slug: FlowRouter.getParam("slug") });
      }
    });
  },
  'focus [name="description"]'(e) {
    $(e.target).attr("rows", "8");
  },
  'blur [name="description"]'(e) {
    $(e.target).attr("rows", "3");
  },
  'change [name="category"]'() {
    var marker = Template.instance().marker;
    Session.set("category", $("#exampleInputCategory").prop("selectedIndex"));
    if (marker) {
      marker.setIcon(Template.instance().icons[Session.get("category")]);
    }
  },
  "click .confirm": function(e) {
    e.preventDefault();
    Session.set("currentPostId", this._id);
    analytics.track("Confirm Idea Deletion", {
      eventName: "Delete Idea"
    });
    $("#confirmModal").modal("show");
  },
  "click .delete": function(e) {
    e.preventDefault();
    var currentPostId = Session.get("currentPostId");
    Posts.remove(currentPostId);
    analytics.track("Deleted Idea", {
      eventName: "Delete Idea"
    });
    $("#confirmModal")
      .on("hidden.bs.modal", function() {
        FlowRouter.go("dashboard");
      })
      .modal("hide");
  }
});
