// Definition of the posts collection

import { Mongo } from 'meteor/mongo';
import { Permissions } from '../../startup/both/permissions.js';

export const Posts = new Mongo.Collection('posts');


validatePost = function (post) {
  var errors = {};

  if (!post.title)
    errors.title = "Please fill in a headline";

  if (!post.url)
    errors.url =  "Please fill in a URL";

  return errors;
}
