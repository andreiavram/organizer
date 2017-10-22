var ng = require('angular');

var LoginController = require('auth/controllers/LoginController');
var Router = require('base/Router');

function initialize() {
    "use strict";
    Router.addState({
        name: 'base.auth',
        abstract: true,
        views: {}
    });
    
    Router.addState({
        name: 'base.auth.login',
        url: '/login',
        isDefault: false,
        views: {
            'main@': {
                templateUrl: '/static/auth/templates/loginForm.html',
                controller: LoginController,
                controllerAs: 'auth'
            }
        }
    });
}

module.exports = initialize;
