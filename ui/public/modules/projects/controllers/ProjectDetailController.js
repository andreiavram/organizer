/**
 * Created by yeti on 28.10.2015.
 */

var Projects = require("projects/Projects");

require("projects/factories/Project");
require("tasks/factories/Task");

function ProjectDetailController($scope, $stateParams, Task, Project) {
    "use strict";
    $scope.project_id = $stateParams.id;
    $scope.project = Project.get({id: $scope.project_id});
    $scope.mode = "view";
    $scope.new_task = {};

    $scope.save_project_task = function () {
        $scope.new_task.project = $scope.project_id;
        Task.save($scope.new_task, function (data) {
            $scope.new_task = {};
            $scope.project.tasks.push(data);
        });
    };

}

Projects.controller("ProjectDetailController", [
    "$scope",
    "$stateParams",
    "Task",
    "Project",

    ProjectDetailController
]);

module.exports = ProjectDetailController;