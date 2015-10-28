/**
 * Created by yeti on 20.10.2015.
 */

var _ = require('lodash');

var State = require('base/State');
var Tasks = require('tasks/Tasks');
var LuminanceCalculator = require("tags/factories/LuminanceCalculator");

require("base/filters/UrlFilter");
require('tags/factories/Tag');
require('tasks/factories/Task');


function TaskDetailController($scope, $stateParams, $location, $filter, Task, Tag) {
    "use strict";

    $scope.mode = 'view';
    $scope.task_id = $stateParams.id;

    $scope.process_task_from_server = function () {
        $scope.load_tags().then(function (tags) {
            $scope.task.tags = _.filter(tags, function (e) { return _.indexOf($scope.task.tags, e.id) >= 0; });
            $scope.tags = $scope.task.tags;
        });
    };

    $scope.process_task_for_server = function () {
        $scope.task.tags = _.pluck($scope.task.tags, "id");
    };

    $scope.task = Task.get({id: $scope.task_id});
    $scope.task.$promise.then(function(data){
        $scope.process_task_from_server();
    });

    $scope.calculate_luminance = LuminanceCalculator;

    $scope.task_errors = {};

    $scope.remove_task = function remove_task() {
        $scope.task.$delete().then(function () {
            $location.path('tasks/');
        });
    };

    $scope.toggle_mode = function toggle_mode() {
        if ($scope.mode === 'view') {
            $scope.mode = 'edit';
        } else {
            $scope.update_task(function () {
                $scope.mode = 'view';
            });
        }
    };

    $scope.load_tags = function load_tags(query) {
        return Tag.query({slug: query}).$promise;
    };

    $scope.toggle_completed = function toggle_completed() {
        $scope.task.completed = !$scope.task.completed;
        $scope.update_task();
    };

    $scope.update_task = function (additional_work) {
        $scope.process_task_for_server();
        $scope.task.$update().then(function () {
            $scope.process_task_from_server();
            if (additional_work) {
                additional_work();
            }
        });
    };

    $scope.task_priority_icon = function task_priority_icon() {
        return {
            1: "fa-arrow-circle-down yellow",
            4: "fa-arrow-circle-up red", 2: "fa-bars green"
        }[$scope.task.priority];
    };

    $scope._toggle_priority = function () {
        $scope.task.priority = $scope.task.priority * 2;
        if ($scope.task.priority > 4) {
            $scope.task.priority = 1;
        }

        $scope.update_task();
    };

    $scope.toggle_priority = _.debounce($scope._toggle_priority, 500);


}

Tasks.controller("TaskDetailController", [
    "$scope",
    "$stateParams",
    "$location",
    "$filter",
    "Task",
    "Tag",

    TaskDetailController
]);

module.exports = TaskDetailController;