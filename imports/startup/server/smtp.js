Meteor.startup(function () {

  var username = 'postmaster@mail.heychango.com';
  var password = 'Ch4ng0';
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
   return "Hola " + user.username + ",\n\n" +
     " Por favor verifica tu correo electrónico haciendo click en el link a continuación:\n\n" +
     url;
};
