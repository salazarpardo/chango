// Tests for the behavior of the Posts collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Posts } from './posts.js';

if (Meteor.isServer) {
  describe('posts collection', function () {
    it('insert correctly', function () {
      const postId = Posts.insert({
        title: 'meteor homepage',
        url: 'https://www.meteor.com',
      });
      const added = Posts.find({ _id: postId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'Posts');
      assert.equal(count, 1);
    });
  });
}
