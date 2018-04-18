import './header.html';

import '../notifications/notifications.js';

Template.header.events({
    'click .btn-logout':function(){
        Meteor.logout();
    }
});
