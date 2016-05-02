var Tasks = require('tasks/Tasks');

function TaskListItemDirective() {
    "use strict";
    return {
        restrict: "E",
        templateUrl: "/static/tasks/templates/task-list-detail.html",
        controller: "TaskListDetailController",
        controllerAs: "item",
        scope: {
            task: "="
        },
        link: function(scope, elem, attrs, item) {
            scope.$watch("task", function(task) {
                item.set_task(task);
            });
        }
    };
}

Tasks.directive("taskListItem", TaskListItemDirective);
module.exports = TaskListItemDirective;