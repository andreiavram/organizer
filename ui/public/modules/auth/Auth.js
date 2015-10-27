var ng = require('angular');
var Config = require("base/Config");
var Cookies = require('angular-cookies');

function checkUser($http, $rootScope) {
    "use strict";
    $http.get(Config.PROFILE_API_URL).then(function (user) {
       $rootScope.user = user;
    });
}

var Auth = ng.module('Auth', [
    Cookies
]);

Auth.run(["$http", "$rootScope", checkUser]);

module.exports = Auth;

require("auth/services/AuthInterceptor");
require("auth/config/interceptor");