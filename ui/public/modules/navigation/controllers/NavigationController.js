/**
 * Created by yeti on 27.10.2015.
 */

var Navigation = require("navigation/Navigation");

function NavigationController($scope) {
    "use strict";

    $scope.menuClass = function (page) {
        // var current = $location.path().substring(1).split("/")[0];
        // return page === current ? "active" : "";
        return "";
    };
}

Navigation.controller("NavigationController", [
    "$scope",

    NavigationController
]);

module.exports = NavigationController;