import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Match } from 'meteor/check'

import { Posts } from '/imports/api/posts/posts.js';
import { Meteor } from 'meteor/meteor';

import './submit.html';

Template.submit.onCreated(function () {
  Session.set('postSubmitErrors', {});

  GoogleMaps.ready('modalMap', function(map) {
        var icons = {
            'Chango': new google.maps.MarkerImage('/markers/marker-chango.svg', null, null, null, new google.maps.Size(40, 40), new google.maps.Point(0, 0), new google.maps.Point(0, 0)),
            'Usr': new google.maps.MarkerImage('/markers/marker-usr.svg', null, null, null, new google.maps.Size(40, 40), new google.maps.Point(0, 0), new google.maps.Point(0, 0))
        }
        var marker, newLocation;
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

            newLocation = event.latLng.lat() + "," + event.latLng.lng();
            $("#exampleInputLocation").val(newLocation);
            codeLatLng();
        });
    });

});

Template.submit.onRendered(function () {
  GoogleMaps.load({key: 'AIzaSyDKcZBwYBkYJx6-GJI1OZjPPOmA40R1fV4'});
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
      var bogota = new google.maps.LatLng(4.60063716865005, -74.08990859985352);
      // Map initialization options
      return {
          center: bogota,
          zoom: 12,
          mapTypeControl: false
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
    console.log(title);
    console.log(isValid);
    if (isValid) {
      var formatted = formatSlug(title.val())
      slug.val(formatted);
    } else {
      slug.val("");
    }
  },
  'change input[type=file]' () {
    var fieldVal = $('#exampleInputImg').val();
    // Change the node's value by removing the fake path (Chrome)
    fieldVal = fieldVal.replace("C:\\fakepath\\", "");
    $('#exampleInputImg').next('.custom-file-label').hide();
    $('#exampleInputImg').toggleClass('form-control custom-file-input').attr('type','text').val(fieldVal);
  },
  'submit form'(e) {
    e.preventDefault();

    var post = {
      // url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
      slug: $(e.target).find('[name=slug]').val(),
      description: $(e.target).find('[name=description]').val(),
      category: $(e.target).find('[name=category]').val(),
      location: $(e.target).find('[name=location]').val().split(','),
      address: $(e.target).find('[name=address]').val()
    };

    console.log(post.location);

    var errors = validatePost(post);
    if (errors.title)
      return Session.set('postSubmitErrors', errors);

    Meteor.call('posts.insert', post, (error, result) => {
      if (error) {
        return throwError(error.reason);
      }
      if (result.postExists) {
        throwError('There is a post with the same slug, please change it');
      } else {
        FlowRouter.go('post', {slug: result.slug});
      }
    });

  }
});
