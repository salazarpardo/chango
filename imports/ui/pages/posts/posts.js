import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './posts.html';

import '../../components/posts/posts_list.js';


Template.posts.helpers({
  routeOption: function(optionName) {
    FlowRouter.watchPathChange();
    return FlowRouter.current().route.options[optionName];
  }
});
