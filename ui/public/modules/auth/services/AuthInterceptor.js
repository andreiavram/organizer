/**
 * Created by yeti on 23.10.2015.
 */

var AUTH_EVENTS = require("auth/constants/auth_events");
var Session = require("auth/services/SessionService");
var AuthService = require("auth/services/AuthService");
var Auth = require("auth/Auth");

function AuthInterceptor($rootScope, $q, $cookies) {
    "use strict";
    return {
        responseError: function (response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized,
                419: AUTH_EVENTS.sessionTimeout,
                440: AUTH_EVENTS.sessionTimeout
            }[response.status], response);
            return $q.reject(response);
        },
        request: function (request) {
            var auth_token = $cookies.get("auth-token");
            if (auth_token) {
                request.headers.Authorization = "Token " + auth_token;
            }
            return request;
        }
    };
}

Auth.factory('AuthInterceptor', [
    "$rootScope",
    "$q",
    "$cookies",

    AuthInterceptor
]);

module.exports = AuthInterceptor;