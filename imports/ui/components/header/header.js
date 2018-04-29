import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './header.html';

import '../notifications/notifications.js';

import fontawesome from '@fortawesome/fontawesome/';
import faLightbulb from '@fortawesome/fontawesome-free-regular/faLightbulb'
import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt'

fontawesome.library.add(faLightbulb)
fontawesome.library.add(faSignOutAlt)

Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
      FlowRouter.watchPathChange();
      return FlowRouter.current() && FlowRouter.current().route.name === name
    });

    return active && 'active';
  },
});

Template.header.events({
    'click .btn-logout':function(){
        Meteor.logout();
    }
});
