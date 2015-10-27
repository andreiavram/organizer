var ng = require('angular');

var Router = require('base/Router');
var TaskListController = require('tasks/controllers/TaskListController');
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
                controller: TaskListController
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
            'task@': {
                templateUrl: '/static/tasks/templates/task-detail.html',
                controller: TaskDetailController
            }
        }
    });
}

module.exports = initialize;
