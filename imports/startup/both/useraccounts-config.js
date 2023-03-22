import { Meteor } from "meteor/meteor";
import { AccountsTemplates } from "meteor/useraccounts:core";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { T9n } from "meteor-accounts-t9n";

T9n.map("es", {
  error: {
    accounts: {
      "Verify email link expired": "El enlace para verificar tu correo expiró.",
      "Already verified": "Tu correo ya fue verificado",
      "Incorrect password": "Contraseña incorrecta",
      "User not found": "Usuario no encontrado",
    },
  },
});

T9n.setLanguage("es");

AccountsTemplates.configure({
  defaultTemplate: "",
  defaultLayout: "App_body",
  defaultLayoutRegions: {
    top: "header",
    errors: "errors",
    footer: "footer",
  },
  defaultContentRegion: "main",
  confirmPassword: false,
  enablePasswordChange: true,
  sendVerificationEmail: true,
  enforceEmailVerification: true,
  focusFirstInput: true,

  // Appearance
  showAddRemoveServices: false,
  showForgotPasswordLink: true,
  showLabels: true,
  showResendVerificationEmailLink: true,

  // Client-side Validation
  continuousValidation: false,
  negativeFeedback: false,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,

  // Privacy Policy and Terms of Use
  privacyUrl: "privacidad",
  termsUrl: "terminos",

  // Texts
  texts: {
    title: {
      changePwd: "Cambiar contraseña",
      forgotPwd: "¿Olvidaste tu contraseña?",
      resetPwd: "Reestablece tu contraseña",
      signIn: "Ingresa a tu cuenta",
      signUp: "Crea tu cuenta",
      verifyEmail: "Verificando tu correo electrónico",
      resendVerificationEmail: "Reenvía tu correo de verificación",
      enrollAccount: "Conecta tu cuenta",
    },
    info: {
      emailSent: "El correo ha sido enviado a tu cuenta",
      emailVerified: "Tu correo electrónico ha sido verificado",
      pwdChanged: "Tu contraseña ha cambiado",
      pwdReset: "Has reestablecido tu contraseña",
      pwdSet: "Has reestablecido tu contraseña",
      signUpVerifyEmail:
        "¡Tu cuenta ha sido creada! Por favor revisa tu correo y sigue las instrucciones.",
      verificationEmailSent:
        "Te hemos enviado un nuevo correo electrónico. Si el correo no aparece en tu bandeja de entrada, asegúrate de revisar tu carpeta de spam.",
    },
    errors: {
      accountsCreationDisabled: "La creación de cuentas esta deshabilitada",
      cannotRemoveService: "No se puede remover el único servicio activo",
      captchaVerification: "Fallo en la verificación del captcha",
      loginForbidden:
        "error.accounts.Inicio de sesión no permitido. Revisa tus datos.",
      mustBeLoggedIn: "error.accounts.Debes ingresar a tu cuenta",
      pwdMismatch: "error.pwdsDontMatch",
      validationErrors: "Errores de validación",
      verifyEmailFirst:
        "Por favor verifica tu correo eléctronico primero. Revisa tu correo y sigue el enlace",
    },
    sep: "O",
    minRequiredLength: "Caracteres requeridos (mínimo)",
    requiredField: "Requerido",
    pwdLink_pre: "",
    pwdLink_link: "¿Olvidaste tu contraseña?",
    pwdLink_suff: "",
    resendVerificationEmailLink_pre:
      "¿No encuentras tu correo de verificación?",
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
      forgotPwd: "Recibir enlace",
      resetPwd: "Reestablece tu contraseña",
      resendVerificationEmail: "Enviar correo de nuevo",
    },
    socialSignUp: "Regístrate",
    socialSignIn: "Ingresa",
    socialWith: "con",
    socialIcons: {
      facebook: "fab fa-facebook",
      google: "fab fa-google",
    },
    termsPreamble: "Al crear tu cuenta aceptas estar de acuerdo con nuestra",
    termsPrivacy: "política de privacidad",
    termsAnd: "y",
    termsTerms: "términos y condiciones.",

    inputIcons: {
      isValidating: "fas fa-spinner fa-spin",
      hasSuccess: "fas fa-check",
      hasError: "fas fa-times",
    },
  },
});

AccountsTemplates.configureRoute("signIn", {
  name: "signin",
  path: "/ingreso",
  redirect: function () {
    var user = Meteor.user();
    var next = FlowRouter.getQueryParam("next");

    if (user && next) {
      FlowRouter.go(next);
    } else {
      FlowRouter.go("dashboard");
    }
  },
});

AccountsTemplates.configureRoute("signUp", {
  name: "join",
  path: "/registro",
  redirect: function () {
    var user = Meteor.user();
    var next = FlowRouter.getQueryParam("next");

    if (user && next) {
      FlowRouter.go(next);
    } else {
      FlowRouter.go("new");
    }
  },
});

AccountsTemplates.configureRoute("forgotPwd", {
  name: "forgotPwd",
  path: "/olvide",
});

AccountsTemplates.configureRoute("resendVerificationEmail", {
  name: "resendVerificationEmail",
  path: "/reenviar",
});

AccountsTemplates.configureRoute("changePwd", {
  name: "changePwd",
  path: "/cambiar",
});

AccountsTemplates.configureRoute("verifyEmail", {
  name: "verifyEmail",
  path: "/verificar",
  redirect: function () {
    var user = Meteor.user();

    if (user) {
      FlowRouter.go("dashboard");
    }
  },
});

AccountsTemplates.configureRoute("resetPwd", {
  name: "resetPwd",
  path: "/reestablecer",
  redirect: function () {
    var user = Meteor.user();

    if (user) {
      FlowRouter.go("dashboard");
    }
  },
});

if (Meteor.isServer) {
  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  }

  Meteor.methods({
    userExists(username) {
      check(username, String);
      sleep(1000);
      var user = Meteor.users.findOne({ username: username });
      if (user) return "El nombre de usuario ya existe.";
      return false;
    },
    emailExists(email) {
      check(email, String);
      sleep(1000);
      var emailAlreadyExist =
        Meteor.users.find({ "emails.address": email }, { limit: 1 }).count() >
        0;
      if (emailAlreadyExist) return "El correo electrónico ya existe.";
      return false;
    },
  });
}

AccountsTemplates.removeField("password");
AccountsTemplates.removeField("email");

AccountsTemplates.addFields([
  {
    _id: "username",
    type: "text",
    placeholder: {
      default: "Ingresa tu nombre de usuario",
      signUp: "Elige tu nombre de usuario",
    },
    displayName: "Usuario",
    required: true,
    minLength: 3,
    func: function (value) {
      if (Meteor.isClient) {
        var self = this;
        Meteor.call("userExists", value, function (err, userExists) {
          self.setError(userExists);
          self.setValidating(false);
        });
        return false;
      }
      // Server
      var result = Meteor.call("userExists", value);
      return result;
    },
    errStr: "El nombre de usuario ya existe",
  },
  {
    _id: "email",
    type: "email",
    placeholder: "Ingresa tu correo electrónico",
    required: true,
    displayName: "Correo electrónico",
    re: /.+@(.+){2,}\.(.+){2,}/,
    func: function (value) {
      if (Meteor.isClient) {
        var self = this;
        if (AccountsTemplates.getState() == "signUp") {
          Meteor.call("emailExists", value, function (err, emailExists) {
            self.setError(emailExists);
            self.setValidating(false);
          });
          return false;
        } else {
          self.setValidating(false);
          return false;
        }
      }
      // Server
      var result = Meteor.call("emailExists", value);
      return result;
    },
    errStr: "Correo eléctronico inválido",
  },
  {
    _id: "username_and_email",
    placeholder: "Ingresa tu usuario o correo electrónico",
    type: "text",
    required: true,
    displayName: "Usuario (o correo electrónico)",
  },
  {
    _id: "password",
    type: "password",
    placeholder: {
      default: "Ingresa tu contraseña",
      signIn: "Ingresa tu contraseña",
      signUp: "Mínimo seis caracteres",
      resetPwd: "Mínimo seis caracteres",
      changePwd: "Ingresa tu contraseña nueva",
    },
    displayName: {
      default: "Contraseña",
      changePwd: "Contraseña nueva",
    },
    required: true,
    minLength: 6,
  },
  {
    _id: "current_password",
    type: "password",
    placeholder: {
      default: "Ingresa tu contraseña actual",
    },
    displayName: {
      default: "Contraseña actual",
    },
    minLength: 6,
  },
]);
