var Tasks = require('tasks/Tasks');

function TaskListDirective() {
    "use strict";
    return {
        restrict: "AE",
        // bindToController: true,
        templateUrl: "/static/tasks/templates/task-list-component.html",
        controller: "TaskListController",
        controllerAs: "taskList",
        scope: {
            tasks: "="
        },
        link: function(scope, elem, attrs, taskList) {
            scope.$watch("tasks", function(old, task_list) {
                task_list.$promise.then(function (data) {
                    taskList.update_tasks(task_list);
                });
            });
        }
    };
}

Tasks.directive("taskList", TaskListDirective);
module.exports = TaskListDirective;