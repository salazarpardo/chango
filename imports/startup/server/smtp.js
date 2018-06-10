import { SSR } from 'meteor/meteorhacks:ssr';
SSR.compileTemplate('htmlEmail', Assets.getText('email.html'));

Meteor.startup(function () {

  var username = 'postmaster@heychango.com';
  var password = 'Ch4ng02018';
  var server = 'smtp.mailgun.org';
  var port = '25';

    process.env.MAIL_URL = 'smtp://' +
    encodeURIComponent(username) + ':' +
    encodeURIComponent(password) + '@' +
    encodeURIComponent(server) + ':' + port;


  Accounts.emailTemplates.siteName = "Chango";

  Accounts.emailTemplates.from = "Chango <hey@heychango.com>";

});

Accounts.emailTemplates.verifyEmail.subject = function (user) {
    return "¡Bienvenido a Chango! Por favor verifica tu dirección de correo electrónico";
};

Accounts.emailTemplates.verifyEmail.html = function (user, url) {
  var emailData = {
    user: user,
    url: url,
    message: 'Por favor verifica tu correo electrónico haciendo click en el link a continuación:',
    action: 'Verificar mi correo electrónico',
  };
  return SSR.render('htmlEmail', emailData);
};

Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Reestablece tu contraseña en Chango";
};

Accounts.emailTemplates.resetPassword.html = function (user, url) {
  var emailData = {
    user: user,
    url: url,
    message: 'Por favor reestablece tu contraseña haciendo click en el link a continuación:',
    action: 'Reestablecer contraseña',
  };
  return SSR.render('htmlEmail', emailData);
};
