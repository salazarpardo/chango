import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Match } from 'meteor/check'

import { Posts } from '/imports/api/posts/posts.js';
import { Meteor } from 'meteor/meteor';

import {styles} from '/imports/startup/client/map_styles.js';

import './submit.html';


Template.submit.onCreated(function () {
  Session.set('postSubmitErrors', {});
  self = this;
  GoogleMaps.ready('modalMap', function(map) {

    self.icons = {
        'Chango': new google.maps.MarkerImage('/markers/marker-chango.svg', null, null, null, new google.maps.Size(40, 40), new google.maps.Point(0, 0), new google.maps.Point(0, 0)),
        'Usr': new google.maps.MarkerImage('/markers/marker-usr.svg', null, null, null, new google.maps.Size(40, 40), new google.maps.Point(0, 0), new google.maps.Point(0, 0))
    }

    var marker, newLocation;

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
                icon: self.icons['Chango']
            });
        } else {
            marker.setPosition(event.latLng);
        }

        google.maps.event.addListener(marker, 'dragend', function(event) {
            newLocation = event.latLng.lat() + "," + event.latLng.lng();
            console.log(newLocation);
            $("#exampleInputLocation").val(newLocation);
            codeLatLng();
        });

        newLocation = event.latLng.lat() + "," + event.latLng.lng();
        $("#exampleInputLocation").val(newLocation);
        codeLatLng();
    });
  });

});

Template.submit.onRendered(function () {
  GoogleMaps.load({key: 'AIzaSyDKcZBwYBkYJx6-GJI1OZjPPOmA40R1fV4'});

  // Emulating placeholder behaviour on select dropdowns.
  if ($('select').length) {
      $.each($('select'), function(i, val) {
          var $el = $(val);

          if (!$el.val()) {
              $el.addClass("not-chosen");
          }

          $el.on("change", function() {
              if (!$el.val())
                  $el.addClass("not-chosen");
              else
                  $el.removeClass("not-chosen");
          });

      });
  }

});

Template.submit.helpers({
  'currentUrl'() {
    return window.location.origin;
  },
  'errorMessage'(field) {
    return Session.get('postSubmitErrors')[field];
  },
  'errorClass'(field) {
    return !!Session.get('postSubmitErrors')[field] ? 'is-invalid' : '';
  },
  'mapOptions'() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      var bogota = new google.maps.LatLng(4.710249429547743,-74.07099918512495);
      // Map initialization options
      return {
          center: bogota,
          zoom: 12,
          mapTypeControl: false,
          styles: styles
      };
    }
  },
});

Template.submit.events({
  'blur [name="title"]'() {
    var form  = $("#add-post"),
        title = form.find("[name='title']"),
        slug  = form.find("[name='slug']");
    var isValid = title[0].validity.valid;
    if (isValid) {
      var formatted = formatSlug(title.val())
      slug.val(formatted);
    } else {
      slug.val("");
    }
  },
  'submit form'(e) {
    e.preventDefault();

    var post = {
      title: $(e.target).find('[name=title]').val(),
      slug: $(e.target).find('[name=slug]').val(),
      description: $(e.target).find('[name=description]').val(),
      category: $(e.target).find('[name=category]').val(),
      location: $(e.target).find('[name=location]').val().split(','),
      address: $(e.target).find('[name=address]').val(),
    };

    var errors = validatePost(post);
    if (errors.title || errors.description || errors.location  ) {
      console.log(errors);
      return Session.set('postSubmitErrors', errors);
    } else {
        Session.set('postSubmitErrors', errors);
    }

    Meteor.call('posts.insert', post, (error, result) => {
      if (error) {
        return throwError(error.reason, 'alert-danger');
      }
      if (result.postExists) {
        throwError('Existe una idea con la misma ruta. Intenta de nuevo después de cambiarla.', 'alert-info');
      } else {
        analytics.track('posts.insert', post);
        FlowRouter.go('post', {slug: result.slug});
      }
    });

  },
  'click .geoloc': function(e) {
    $('.geoloc').toggleClass('active');
    $('.geoloc .svg-inline--fa').toggleClass('fa-location-arrow fa-spinner fa-spin');
    var map = GoogleMaps.maps.modalMap.instance;
    var icons =  Template.instance().icons;
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
