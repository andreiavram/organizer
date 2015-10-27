/**
 * Created by yeti on 23.10.2015.
 */

var Config = require("base/Config");
var Auth = require("auth/Auth");
var Session = require("auth/services/SessionService");

function AuthService($http, $cookies) {
    "use strict";
    var authService = {};

    authService.login = function (credentials) {
        return $http
            .post(Config.LOGIN_API_URL, credentials)
            .then(function (res) {
                Session.create(res.data.key, res.data.user, res.data.role);
                $cookies.remove("auth-token");
                $cookies.put("auth-token", res.data.key);
                return res.data.key;
            });
    };

    authService.isAuthenticated = function () {
        return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return authService;
}


Auth.factory('AuthService', [
    "$http",
    "$cookies",

    AuthService
]);

module.exports = new AuthService();