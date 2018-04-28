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
