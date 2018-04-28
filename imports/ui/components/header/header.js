import './header.html';

import '../notifications/notifications.js';

import fontawesome from '@fortawesome/fontawesome/';
// import FontAwesomeBrands from '@fortawesome/fontawesome-free-brands/';
// import FontAwesomeRegular from '@fortawesome/fontawesome-free-regular/';
// import FontAwesomeSolid from '@fortawesome/fontawesome-free-solid/';
import faLightbulb from '@fortawesome/fontawesome-free-regular/faLightbulb'

fontawesome.library.add(faLightbulb)

Template.header.events({
    'click .btn-logout':function(){
        Meteor.logout();
    }
});
