import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './auth.html';

Template.signup.events({
    'submit .register-form': function (event) {

        event.preventDefault();


        var email = event.target.email.value;
        var password = event.target.password.value;
        var firstname = event.target.firstname.value;
        var lastname = event.target.lastname.value;

        var user = {'email':email,password:password,profile:{name:firstname + " " + lastname}};

        Accounts.createUser(user,function(err){
            if(!err) {
                FlowRouter.go('/');
            }
        });
    }
});

Template.login.events({
    'submit .login-form': function (event) {
        event.preventDefault();
        var email = event.target.email.value;
        var password = event.target.password.value;

        Meteor.loginWithPassword(email,password,function(err){
            if(!err) {
                FlowRouter.go('/');
            }
        });
    },
    'click .btn-facebook':function(event){
        event.preventDefault();
        Meteor.loginWithFacebook(function(err){
            if(!err) {
                Router.go('/');
            }
        });
    }
});
