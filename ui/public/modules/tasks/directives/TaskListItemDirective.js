var Tasks = require('tasks/Tasks');

function TaskListItemDirective() {
    "use strict";
    return {
        restrict: "AE",
        templateUrl: "/static/tasks/templates/task-list-detail.html",
        controller: "TaskListDetailController",
        controllerAs: "item",
        require: ['taskListItem', '^taskList'],
        scope: {
            task: "="
        },
        link: function(scope, elem, attrs, controllers) {
            controllers[0].taskList = controllers[1];
            scope.$watch("task", function(task) {
                controllers[0].set_task(task);
            });
        }
    };
}

Tasks.directive("taskListItem", TaskListItemDirective);
module.exports = TaskListItemDirective;