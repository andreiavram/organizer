/**
 * Created by yeti on 23.10.2015.
 */


var Auth = require("auth/Auth");
var AUTH_EVENTS = require("auth/constants/auth_events");

function loginDialog() {
    "use strict";
    return {
        restrict: 'A',
        template: '<div ng-if="visible" ng-include="\'static/auth/templates/loginForm.html\'">',
        link: function (scope) {
            var showDialog = function () {
                scope.visible = true;
            };

            scope.visible = false;
            scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
            scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
        }
    };
}

Auth.directive('loginDialog', loginDialog);