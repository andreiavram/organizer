var ng = require('angular');
var uiRouter = require('angular-ui-router');
var ngStrap = require('angular-bootstrap');

var Router = require('base/Router');

function Base() {
    var module = ng.module('Base', ['ui.router', 'ui.bootstrap']);

    module.initialize = function(callback) {
        module.config([
            '$stateProvider',
            '$urlRouterProvider',
            
            function(StateProvider, UrlRouterProvider) {
                Router.initialize(StateProvider, UrlRouterProvider);
                callback();
            }
        ]);
    };
    
    return module;
}

module.exports = new Base();
