var ng = require('angular');

var TaskListController = require('tasks/controllers/TaskListController');
var TaskListDirective = require('tasks/directives/TaskListDirective');
var TaskListDetailController = require('tasks/controllers/TaskListDetailController');
var TaskListItemDirective = require('tasks/directives/TaskListItemDirective');

var Router = require('base/Router');
var TaskMainController= require('tasks/controllers/TaskMainController');
var TaskDetailController = require('tasks/controllers/TaskDetailController');
var AuthResolver = require("auth/services/AuthResolver");

function initialize() {
    Router.addState({
        name: 'base.tasks',
        abstract: true,
        views: {}
    });

    Router.addState({
        name: 'base.tasks.list',
        url: '/tasks',
        isDefault: true,
        views: {
            'main@': {
                templateUrl: '/static/tasks/templates/task-list.html',
                controller: TaskMainController
                // controllerAs: 'demo'
            }
        },
        resolve: {
            //auth: function resolveAuthentication(AuthResolver) {
            //    "use strict";
            //    return AuthResolver.resolve();
            //}
        }
    });

    Router.addState({
        name: 'base.tasks.detail',
        url: '/tasks/{id:int}/',
        isDefault: false,
        views: {
            'main@': {
                templateUrl: '/static/tasks/templates/task-detail.html',
                controller: TaskDetailController
            }
        }
    });
}

module.exports = initialize;
