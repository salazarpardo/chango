import { Meteor } from "meteor/meteor";

Meteor.publish("userProfile", function(username) {
  check(username, String);
  // try to find the user by username
  var user = Meteor.users.findOne({
    $or: [{ username: username }, { "profile.name": username }]
  });
  // if we can't find it, mark the subscription as ready and quit
  if (!user) {
    this.ready();
    return;
  }
  // if the user we want to display the profile is the currently logged in user...
  if (this.userId === user._id) {
    // then we return the corresponding full document via a cursor
    return Meteor.users.find(this.userId);
  } else {
    // if we are viewing only the public part, strip the "profile"
    // property from the fetched document, you might want to
    // set only a nested property of the profile as private
    // instead of the whole property
    return Meteor.users.find(user._id, {
      fields: {
        username: 1,
        profile: 1
      }
    });
  }
});
