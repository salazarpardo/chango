// Definition of the posts collection

import { Mongo } from "meteor/mongo";
import { Permissions } from "../../startup/both/permissions.js";
import { SubsManager } from "meteor/meteorhacks:subs-manager";

export const Posts = new Mongo.Collection("posts");

validatePost = function(post) {
  var errors = {};

  if (!post.title) errors.title = "Tu idea necesita un título";

  if (!post.description)
    errors.description = "Tu idea necesita una descripción";

  if (!post.location[0])
    errors.location = "Tu idea necesita una ubicación en el mapa";

  return errors;
};

export const subs = new SubsManager();
