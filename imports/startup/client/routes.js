// import { FlowRouter } from 'meteor/kadira:flow-router';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/components/header/header.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/auth/auth.js';
import '../../ui/pages/about/about.js';
import '../../ui/pages/submit/submit.js';
import '../../ui/pages/edit/edit.js';
import '../../ui/pages/post/post.js';
import '../../ui/pages/not_found/not_found.js';
import '../../ui/pages/access_denied/access_denied.js';

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

Tracker.autorun(function () {
  if (!Meteor.userId()) {
    FlowRouter.go('home');
  }
});

// ************************* ROUTES ********************************

var publicRoutes = FlowRouter.group({
  name: 'public',
  triggersEnter: [ redirectIfLoggedIn ],
})

publicRoutes.route('/', {
  name: 'home',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'home' });
  },
  triggersExit: []
});

publicRoutes.route('/signup', {
  name: 'signup',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'signup' });
  },
  triggersExit: []
});

publicRoutes.route('/login', {
  name: 'login',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'login' });
  },
  triggersExit: []
});

publicRoutes.route('/about', {
  name: 'about',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'about' });
  },
  triggersExit: []
});

publicRoutes.route('/post/:_id', {
  name: 'post',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'post' });
  },
  triggersExit: []
});

publicRoutes.route('/login', {
  name: 'login',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'accessDenied' });
  },
  triggersExit: []
});

var privateRoutes = FlowRouter.group({
  name: 'private',
  triggersEnter: [ checkLoggedIn ],
})

privateRoutes.route('/submit', {
  name: 'submit',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'submit' });
  },
  triggersExit: []
})

privateRoutes.route('/post/:_id/edit', {
  name: 'postEdit',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'postEdit' });
  },
  triggersExit: []
});

FlowRouter.route('*', {
  name: 'notFound',
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'App_notFound' });
  }
});
