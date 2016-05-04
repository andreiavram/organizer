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
            scope.$watch("tasks", function(task_list, old_task_list) {
                taskList.update_tasks(task_list);
            }, true);
        }
    };
}

Tasks.directive("taskList", TaskListDirective);
module.exports = TaskListDirective;