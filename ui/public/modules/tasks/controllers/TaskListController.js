/**
 * Created by yeti on 20.10.2015.
 */

var _ = require('lodash');

var State = require('base/State');
var Tasks = require('tasks/Tasks');
var Task = require('tasks/factories/Task');
var Tag = require('tags/factories/Tag');

function TaskListController($scope, $stateParams, $location, Task, Tag, LuminanceCalculator) {
    "use strict";

    this.remove_task = function remove_task(task) {
        Task.remove(task, function (data) {
            this.tasks = _.without(this.tasks, task);
        });
    };

    this.unsolved_tasks = function unsolved_tasks() {
        return _.filter(this.tasks, function (e) { return !e.completed; }).length;
    };

    this.update_tasks = function(tasks) {
        this.tasks = _.sortBy(tasks, "changed_date").reverse();
    };
}

Tasks.controller("TaskListController", [
    "$scope",
    "$stateParams",
    "$location",
    "Task",
    "Tag",
    TaskListController
]);

module.exports = TaskListController;