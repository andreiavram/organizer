/**
 * Created by yeti on 23.10.2015.
 */

var Auth = require("auth/Auth");
var AUTH_EVENTS = require("auth/constants/auth_events");
// var AuthService = require("auth/services/AuthService");

function LoginController($scope, $rootScope, AuthService) {
    "use strict";

    $scope.credentials = {
        username: '',
        password: ''
    };

    $scope.login = function (credentials) {
        AuthService.login(credentials).then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
}


Auth.controller("LoginController", [
    "$scope",
    "$rootScope",
    "AuthService",

    LoginController
]);

module.exports = LoginController;