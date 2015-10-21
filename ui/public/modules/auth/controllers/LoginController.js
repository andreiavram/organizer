var _ = require('lodash');

var Auth = require('auth/Auth');
var AuthService = require('auth/services/AuthService');
var State = require('base/State');

function LoginController($scope) {
    var self = this;
    
    this.credentials = {
        username: '',
        password: ''
    };
    this.failed = false;
    this.login = login;

    function login(form, e) {
        e.preventDefault();
        
        self.failed = false;
        AuthService.login(self.credentials)
            .then(function(token) {
                State.go('base.dash.taxonomy');
            })
            .catch(function(error) {
                self.failed = true;
            });
    }
}

Auth.controller('LoginController', [
    '$scope',
    '$state',
    
    LoginController
]);

module.exports = LoginController;
