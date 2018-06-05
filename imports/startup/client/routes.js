// import { FlowRouter } from 'meteor/kadira:flow-router';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/components/header/header.js';
import '../../ui/components/footer/footer.js';
import '../../ui/components/hero/hero.js';
import '../../ui/components/newsletter/newsletter.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/posts/posts.js';
import '../../ui/pages/map/map.js';
import '../../ui/pages/auth/auth.js';
import '../../ui/pages/about/about.js';
import '../../ui/pages/contact/contact.js';
import '../../ui/pages/submit/submit.js';
import '../../ui/pages/profile/profile.js';
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
})

publicRoutes.route('/idea/:slug', {
  name: 'post',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'post', errors: 'errors', footer: 'footer' });
  },
  triggersExit: []
});

publicRoutes.route('/acerca', {
  name: 'about',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'about', errors: 'errors', footer: 'footer' });
  },
  triggersExit: []
});

publicRoutes.route('/contacto', {
  name: 'contact',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'contact', errors: 'errors', footer: 'footer' });
  },
  triggersExit: []
});

publicRoutes.route('/recientes', {
  name: 'new',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'posts', errors: 'errors', footer: 'footer' });
  },
  title: "Recientes"
});

publicRoutes.route('/populares', {
  name: 'best',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'posts', errors: 'errors', footer: 'footer' });
  },
  title: "Populares"
});

publicRoutes.route('/mapa', {
  name: 'map',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'map', errors: 'errors', footer: 'footer' });
  },
  triggersExit: []
});

publicRoutes.route('/salir', {
  name: 'logout',
  action() {
    Accounts.logout();
    FlowRouter.redirect('/');
  }
});

publicRoutes.route('/', {
  name: 'home',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', page: 'home', main: 'newsletter', errors: 'errors', hero: 'hero', footer: 'footer' });
  },
  triggersExit: []
});

var privateRoutes = FlowRouter.group({
  name: 'private',
  triggersEnter: [ AccountsTemplates.ensureSignedIn ],
})

privateRoutes.route('/nueva', {
  name: 'submit',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'submit', errors: 'errors', footer: 'footer' });
  },
  triggersExit: []
})

privateRoutes.route('/perfil', {
  name: 'profile',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'profile', errors: 'errors', footer: 'footer' });
  },
  triggersExit: []
})

privateRoutes.route('/idea/:slug/editar', {
  name: 'postEdit',
  triggersEnter: [],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'postEdit', errors: 'errors', footer: 'footer' });
  },
  triggersExit: []
});

FlowRouter.route('*', {
  name: 'notFound',
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'App_notFound', errors: 'errors', footer: 'footer' });
  }
});

previousPathsObj = {};
exemptPaths = ['/place/']; // these are the paths that we don't want to remember the scroll position for.
function thisIsAnExemptPath(path) {
     var exemptPath = false;
     _.forEach(exemptPaths, function (d) {
         if (path.indexOf(d) >= 0) {
             exemptPath = true;
             return exemptPath;
      }
   });
  return exemptPath;
}
function saveScrollPosition(context) {
   var exemptPath = thisIsAnExemptPath(context.path);
   if (!exemptPath) {
       // add / update path
       previousPathsObj[context.path] = $(window).scrollTop();
   }
}
function jumpToPrevScrollPosition(context) {
   var path = context.path;
   var scrollPosition = 0;
   if (!_.isUndefined(previousPathsObj[context.path])) {
       scrollPosition = previousPathsObj[context.path];
   }
   if (scrollPosition === 0) {
       // we can scroll right away since we don't need to wait for rendering
       $('html, body').animate({scrollTop: scrollPosition}, 0);
   } else {
   // Now we need to wait a bit for blaze/react does rendering.
   // We assume, there's subs-manager and we've previous page's data.
   // Here 10 millis delay is a arbitrary value with some testing.
   setTimeout(function () {
      $('html, body').animate({scrollTop: scrollPosition}, 0);
    }, 100);
   }
}
FlowRouter.triggers.exit([saveScrollPosition]);
FlowRouter.triggers.enter([jumpToPrevScrollPosition]);
