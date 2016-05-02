var Tasks = require('tasks/Tasks');

function TaskListDirective() {
    "use strict";
    return {
        restrict: "E",
        templateUrl: "/static/tasks/templates/task-list-component.html",
        controller: "TaskListController",
        controllerAs: "taskListCtrl",
        scope: {
            tasks: "="
        },
        link: function(scope, elem, attrs, taskListCtrl) {
            scope.$watch("tasks", function(task_list) {
                taskListCtrl.update_tasks(task_list);
            });
        }
    };
}

Tasks.directive("taskList", TaskListDirective);
module.exports = TaskListDirective;