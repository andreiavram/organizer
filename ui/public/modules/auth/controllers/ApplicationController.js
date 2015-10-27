/**
 * Created by yeti on 23.10.2015.
 */

var Auth = require("auth/Auth");
var AuthService = require("auth/services/AuthService");
var USER_ROLES = require("auth/constants/user_roles");
var AUTH_EVENTS = require("auth/constants/auth_events");

require("auth/directives/LoginDialog");
require("auth/directives/FormAutofillFix");

function ApplicationController($scope, $state) {
    "use strict";
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;

    $scope.$on(AUTH_EVENTS.notAuthenticated, function (data) {
        $state.go('base.auth.login');
    });

    $scope.$on(AUTH_EVENTS.loginSuccess, function (data) {
        console.log("login success");
        $state.go('base.tasks.list');
    });

    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };
}

Auth.controller('ApplicationController', [
    "$scope",
    "$state",

    ApplicationController
]);

module.exports = ApplicationController;