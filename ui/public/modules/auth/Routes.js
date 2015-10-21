var ng = require('angular');

var Router = require('base/Router');
var LoginController = require('auth/controllers/LoginController');

function initialize() {
    Router.addState({
        name: 'base.auth',
        abstract: true,
        views: {}
    });
    
    Router.addState({
        name: 'base.auth.login',
        url: '/login',
        isDefault: true,
        views: {
            'demo@': {
                templateUrl: '/static/auth/templates/login.html',
                controller: LoginController,
                controllerAs: 'auth'
            }
        }
    });
}

module.exports = initialize;
