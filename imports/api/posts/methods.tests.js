// Tests for Posts methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { Posts } from "./Posts.js";
import "./methods.js";

if (Meteor.isServer) {
  describe("Posts methods", function() {
    beforeEach(function() {
      Posts.remove({});
    });

    it("can add a new post", function() {
      const addPost = Meteor.server.method_handlers["Posts.insert"];

      addpost.apply({}, ["meteor.com", "https://www.meteor.com"]);

      assert.equal(Posts.find().count(), 1);
    });
  });
}
