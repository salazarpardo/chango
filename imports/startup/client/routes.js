// import { FlowRouter } from 'meteor/kadira:flow-router';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/components/header/header.js';
import '../../ui/components/hero/hero.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/map/map.js';
import '../../ui/pages/auth/auth.js';
import '../../ui/pages/about/about.js';
import '../../ui/pages/submit/submit.js';
import '../../ui/pages/edit/edit.js';
import '../../ui/pages/post/post.js';
import '../../ui/pages/not_found/not_found.js';
import '../../ui/pages/access_denied/access_denied.js';

// Import to override accounts templates
import '../../ui/accounts/accounts-templates.js';

// ******************* GLOBAL SETTINGS *****************************

function redirectIfLoggedIn (ctx, redirect) {
  // if (Meteor.userId()) {
  //   //redirect('/submit')
  // }
}

function checkLoggedIn (ctx, redirect) {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
     const route = FlowRouter.current();
     if (route.route.name !== 'login') {
       Session.set('redirectAfterLogin', route.path);
     }
     return FlowRouter.go('login');
   }
}

Accounts.onLogin(function() {
  const redirect = Session.get('redirectAfterLogin');
  if (redirect != null) {
    if (redirect !== '/login') {
      return FlowRouter.go(redirect);
    }
  }
});


// ************************* ROUTES ********************************

var publicRoutes = FlowRouter.group({
  name: 'public',
  triggersEnter: [ redirectIfLoggedIn ],
})

publicRoutes.route('/post/:slug', {
  name: 'post',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'post', errors: 'errors' });
  },
  triggersExit: []
});

publicRoutes.route('/about', {
  name: 'about',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'about', errors: 'errors' });
  },
  triggersExit: []
});

publicRoutes.route('/new', {
  name: 'new',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'home', errors: 'errors' });
  },
  triggersExit: []
});

publicRoutes.route('/best', {
  name: 'best',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'home', errors: 'errors' });
  },
  triggersExit: []
});

publicRoutes.route('/map', {
  name: 'map',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'map', errors: 'errors' });
  },
  triggersExit: []
});

publicRoutes.route('/', {
  name: 'home',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'home', errors: 'errors', hero: 'hero' });
  },
  triggersExit: []
});

var privateRoutes = FlowRouter.group({
  name: 'private',
  triggersEnter: [ AccountsTemplates.ensureSignedIn ],
})

privateRoutes.route('/submit', {
  name: 'submit',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'submit', errors: 'errors' });
  },
  triggersExit: []
})

privateRoutes.route('/post/:slug/edit', {
  name: 'postEdit',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'postEdit', errors: 'errors' });
  },
  triggersExit: []
});

FlowRouter.route('*', {
  name: 'notFound',
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'App_notFound', errors: 'errors' });
  }
});
