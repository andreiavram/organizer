var ng = require('angular');

var Router = require('base/Router');
var TaskListController = require('tasks/controllers/TaskListController');
var TaskDetailController = require('tasks/controllers/TaskDetailController');

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
            'tasks@': {
                templateUrl: '/static/tasks/templates/task-list.html',
                controller: TaskListController
                // controllerAs: 'demo'
            }
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
    })
}

module.exports = initialize;
