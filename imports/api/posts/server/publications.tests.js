// Tests for the posts publications
//
// https://guide.meteor.com/testing.html

import { assert } from "chai";
import { posts } from "../posts.js";
import { PublicationCollector } from "meteor/johanbrook:publication-collector";
import "./publications.js";

describe("posts publications", function() {
  beforeEach(function() {
    posts.remove({});
    posts.insert({
      title: "meteor homepage",
      url: "https://www.meteor.com"
    });
  });

  describe("posts.all", function() {
    it("sends all posts", function(done) {
      const collector = new PublicationCollector();
      collector.collect("posts.all", collections => {
        assert.equal(collections.posts.length, 1);
        done();
      });
    });
  });
});
