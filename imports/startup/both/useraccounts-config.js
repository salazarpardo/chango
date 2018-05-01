import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';

AccountsTemplates.configure({
    defaultTemplate: '',
    defaultLayout: 'App_body',
    defaultLayoutRegions: {
        top: 'header',
        errors: 'errors'
    },
    defaultContentRegion: 'main',
    showForgotPasswordLink: true,
    showAddRemoveServices: true,
    texts: {
        socialIcons: {
          facebook: "fab fa-facebook",
        },
        inputIcons: {
          isValidating: "fas fa-spinner fa-spin",
          hasSuccess: "fas fa-check",
          hasError: "fas fa-times",
        }
    }
});

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/signin',
});

AccountsTemplates.configureRoute('signUp', {
  name: 'join',
  path: '/join',
});

AccountsTemplates.configureRoute('forgotPwd');

AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPwd',
  path: '/reset-password',
});

if (Meteor.isServer) {
  Meteor.methods({
    'userExists'(username) {
      check(username, String);
      return !! Meteor.users.findOne({username: username});
    },
  });
}

var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: 'username',
      type: 'text',
      displayName: "username",
      required: true,
      minLength: 5,
      func: function(value) {
        if (Meteor.isClient) {
          console.log('Validating username...');
          var self = this;
          Meteor.call('userExists', value, function (err, userExists){
            if(!userExists)
              self.setSuccess();
            else
              self.setError(userExists);
            self.setValidating(false);
          });
          return;
        }
        // Server
        return Meteor.call('userExists', value);
      }
  },
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "email",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
  {
      _id: 'username_and_email',
      placeholder: 'Log in with username or email',
      type: 'text',
      required: true,
      displayName: "Login",
  },
  pwd
]);

// AccountsTemplates.addField({
//   _id: 'username',
//   type: 'text',
//   required: true,
//   func: function(value) {
//     if (Meteor.isClient) {
//       console.log('Validating username...');
//       var self = this;
//       Meteor.call('userExists', value, function (err, userExists){
//         if(!userExists)
//           self.setSuccess();
//         else
//           self.setError(userExists);
//         self.setValidating(false);
//       });
//       return;
//     }
//     // Server
//     return Meteor.call('userExists', value);
//   }
// });
