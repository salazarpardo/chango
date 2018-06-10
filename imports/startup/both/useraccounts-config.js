import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { T9n } from 'meteor-accounts-t9n';

T9n.map("es", {
  "Minimum required length: 3": "Mínimo 3 caracteres",
});

T9n.setLanguage("es")

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
    sendVerificationEmail: true,
    enforceEmailVerification: true,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showResendVerificationEmailLink: false,

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
        info: {
            emailSent: "El correo ha sido enviado a tu cuenta",
            emailVerified: "Tu correo electrónico ha sido verificado",
            pwdChanged: "Tu contraseña ha cambiado",
            pwdReset: "Has reestablecido tu contraseña",
            pwdSet: "Has reestablecido tu contraseña",
            signUpVerifyEmail: "¡Tu cuenta ha sido creada! Por favor revisa tu correo y sigue las instrucciones.",
            verificationEmailSent: "Te hemos enviado un nuevo correo electrónico. Si el correo no aparece en tu bandeja de entrada, asegúrate de revisar tu carpeta de spam.",
        },
        errors: {
            accountsCreationDisabled: "La creación de cuentas esta deshabilitada",
            cannotRemoveService: "No se puede remover el único servicio activo",
            captchaVerification: "Fallo en la verificación del captcha",
            loginForbidden: "error.accounts.Inicio de sesión no permitido. Revisa tus datos.",
            mustBeLoggedIn: "error.accounts.Debes ingresar a tu cuenta",
            pwdMismatch: "error.pwdsDontMatch",
            validationErrors: "Errores de validación",
            verifyEmailFirst: "Por favor verifica tu correo eléctronico primero. Revisa tu correo y sigue el enlace",
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
          forgotPwd: "Recibir enlace para reestablecer contraseña",
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
  redirect: function(){
       var user = Meteor.user();

       if (user){
         FlowRouter.go('dashboard');
       }
   }
});

AccountsTemplates.configureRoute('signUp', {
  name: 'join',
  path: '/registro',
  redirect: function(){
       var user = Meteor.user();
       var next = FlowRouter.getQueryParam("next");

       if (user && next){
         FlowRouter.go(next);
       } else {
         FlowRouter.go('new');
      }
   }
});

AccountsTemplates.configureRoute('forgotPwd', {
  name: 'forgotPwd',
  path: '/olvide',
});

AccountsTemplates.configureRoute('verifyEmail', {
  name: 'verifyEmail',
  path: '/verificar',
  redirect: function(){
       var user = Meteor.user();

       if (user){
         FlowRouter.go('dashboard');
       }
   }
});

AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPwd',
  path: '/reestablecer',
  redirect: function(){
       var user = Meteor.user();

       if (user){
         FlowRouter.go('dashboard');
       }
   }
});


if (Meteor.isServer){
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }

    Meteor.methods({
        "userExists"(username){
            check(username, String);
            sleep(1000);
            var user = Meteor.users.findOne({username: username});
            if (user)
                return "El nombre de usuario ya existe."
            return false;
        },
    });
}

AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');

AccountsTemplates.addFields([
  {
      _id: 'username',
      type: 'text',
      placeholder: {
          default: "Ingresa tu nombre de usuario",
          signUp: "Elige tu nombre de usuario"
      },
      displayName: "Usuario",
      required: true,
      minLength: 3,
      func: function(value){
        if (Meteor.isClient) {
            var self = this;
            Meteor.call("userExists", value, function(err, userExists){
                self.setError(userExists);
                self.setValidating(false);
            });
            return false;
        }
        // Server
        var result = Meteor.call("userExists", value);
        return result;
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
          default: "••••••",
          signIn: "Ingresa tu contraseña",
          signUp: "Mínimo seis caracteres",
          resetPwd: "Mínimo seis caracteres"
      },
      displayName: "Contraseña",
      required: true,
      minLength: 6,
  }
]);
