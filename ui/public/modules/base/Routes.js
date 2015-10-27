var ng = require('angular');

var Router = require('base/Router');
var NavigationController = require("navigation/controllers/NavigationController");

function initialize() {
    "use strict";

    Router.addState({
        name: 'base',
        abstract: true,
        views: {
            "navigation@": {
                templateUrl: '/static/navigation/templates/top-navigation.html',
                controller: NavigationController
                // controllerAs: 'demo'
            }
        }
    });
}

module.exports = initialize;
