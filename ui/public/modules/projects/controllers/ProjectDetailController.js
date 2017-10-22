/**
 * Created by yeti on 28.10.2015.
 */

var Projects = require("projects/Projects");
var _ = require("lodash");

require("projects/factories/Project");
require("tasks/factories/Task");
require("tags/factories/Tag");

function ProjectDetailController($scope, $stateParams, Task, Project, Tag) {
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

    $scope.mode = 'add';
    $scope.mode_names = {search : "Caută", add: "Adaugă"};
    $scope.tags = Tag.query();
    $scope.new_task = {};

    $scope.process_search = function (e) {
        // $scope.refresh_tasks();
    };

    $scope.process_task = function process_task(e) {
        e.preventDefault();
        if (e.keyCode === 13) {
            var re_tags = /@tags\(([\w+\-, ]+)\)/i;
            var res = $scope.new_task.title.match(re_tags);
            if (res) {
                var tag_list = _.map(res[1].split(","), function(e) { return e.trim(); });
                $scope.new_task.tags = _.pluck(_.filter($scope.tags, function (e) {
                    return _.indexOf(tag_list, e.slug) >= 0;
                }), "id");

                $scope.new_task.title = $scope.new_task.title.replace(res[0], "");
            }

            $scope.new_task.project = $scope.project.id;

            Task.save($scope.new_task, function (data) {
                $scope.project.tasks.push(data);
                $scope.new_task = {};
            }, function (data) {
                $scope.task_errors = data.data;
            });
        }

        var at_index = $scope.new_task.title.indexOf("@");
    };

    $scope.remove_task = function remove_task(task) {
        Task.remove(task, function (data) {
            $scope.project.tasks = _.without($scope.project.tasks, task);
        });
    };

    $scope.task_state_icon = function task_state_icon(task) {
        return {
            "idea": "fa-lightbulb-o",
            "inprogress": "fa-cogs",
            "blocked": "fa-exclamation-triangle",
            "givenup": "fa-trash-o"
        }[task.status];
    };

    $scope.task_priority_icon = function task_priority_icon(task) {
        return {
            1: "fa-arrow-circle-down yellow",
            4: "fa-arrow-circle-up red", 2: ""
        }[task.priority];
    };

    $scope.toggle_completed = function toggle_completed(task) {
        task.completed = !task.completed;
        task.$update();
    };

    $scope.tags_for_task = function (task) {
        return _.filter($scope.tags, function (e) {
            return _.indexOf(task.tags, e.id) >= 0;
        });
    };



}

Projects.controller("ProjectDetailController", [
    "$scope",
    "$stateParams",
    "Task",
    "Project",
    "Tag",

    ProjectDetailController
]);

module.exports = ProjectDetailController;