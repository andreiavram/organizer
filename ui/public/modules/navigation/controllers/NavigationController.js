/**
 * Created by yeti on 27.10.2015.
 */

var Navigation = require("navigation/Navigation");
require("auth/services/AuthService");

function NavigationController($scope, $state, AuthService) {
    "use strict";

    $scope.menuClass = function (page) {
        // var current = $location.path().substring(1).split("/")[0];
        // return page === current ? "active" : "";
        return "";
    };

    $scope.userLogout = function () {
        AuthService.logout();
        $state.go("base.auth.login");
    };
}

Navigation.controller("NavigationController", [
    "$scope",
    "$state",
    "AuthService",

    NavigationController
]);

module.exports = NavigationController;