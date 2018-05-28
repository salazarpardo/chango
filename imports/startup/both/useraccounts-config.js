import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

AccountsTemplates.configure({
    defaultTemplate: '',
    defaultLayout: 'App_body',
    defaultLayoutRegions: {
        top: 'header',
        errors: 'errors',
        footer: 'footer'
    },
    defaultContentRegion: 'main',
    confirmPassword: false,
    showForgotPasswordLink: true,
    showAddRemoveServices: false,
    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,
    texts: {
        title: {
          changePwd: "Cambiar contraseña",
          forgotPwd: "¿Olvidaste tu contraseña?",
          resetPwd: "Reestablece tu contraseña",
          signIn: "Ingresa a tu cuenta",
          signUp: "Crea tu cuenta",
          verifyEmail: "Verifica tu correo electrónico",
        },
        sep: "O",
        requiredField: "Requerido",
        pwdLink_pre: "",
        pwdLink_link: "¿Olvidaste tu contraseña?",
        pwdLink_suff: "",
        resendVerificationEmailLink_pre: "¿No encuentras tu correo de verificación?",
        resendVerificationEmailLink_link: "Enviar de nuevo",
        resendVerificationEmailLink_suff: "",
        signInLink_pre: "Si ya tienes una cuenta, ",
        signInLink_link: "ingresa",
        signInLink_suff: "",
        signUpLink_pre: "Si aún no tienes una cuenta, ",
        signUpLink_link: "regístrate",
        signUpLink_suff: "",
        button: {
          signUp: "Crea tu cuenta",
          signIn: "Ingresa a tu cuenta",
          changePwd: "Cambia tu contraseña",
          enrollAccount: "Conecta tu cuenta",
          forgotPwd: "Recibir link para reestablecer contraseña",
          resetPwd: "Reestablece tu contraseña",
        },
        socialSignUp: "Regístrate",
        socialSignIn: "Ingresa",
        socialWith: "con",
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
  path: '/ingreso',
});

AccountsTemplates.configureRoute('signUp', {
  name: 'join',
  path: '/registro',
  redirect: function(){
       var user = Meteor.user();
       var next = FlowRouter.getQueryParam("next");

       if (user && next)
         FlowRouter.go(next);
   }
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

// var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.removeField('password');
AccountsTemplates.addFields([
  {
      _id: 'username',
      type: 'text',
      placeholder: {
          default: "Ingresa tu usuario",
          signUp: "Crea tu usuario"
      },
      displayName: "Usuario",
      required: true,
      minLength: 4,
      func: function(value) {
        if (Meteor.isClient) {
          throwError('Validando nombre de usuario...', 'info');
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
      },
      errStr: 'El nombre de usuario ya existe',
  },
  {
      _id: 'email',
      type: 'email',
      placeholder: 'Ingresa tu correo electrónico',
      required: true,
      displayName: "Correo electrónico",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Correo eléctronico inválido',
  },
  {
      _id: 'username_and_email',
      placeholder: 'Ingresa tu usuario o correo electrónico',
      type: 'text',
      required: true,
      displayName: "Usuario (o correo electrónico)",
  },
  {
      _id: 'password',
      type: 'password',
      placeholder: {
          default: "••••",
          signIn: "Ingresa tu contraseña",
          signUp: "Seis caracteres mínimo"
      },
      displayName: "Contraseña",
      required: true,
      minLength: 6,
  }
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
