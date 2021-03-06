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
    var self = this;

    this.tasks = [];
    this.update_tasks = function(tasks) {
        if (tasks.constructor === Array) {
            this.tasks = _.sortBy(tasks, "changed_date").reverse();
        }
    };

    this.remove_task = function(task) {
        var self = this;
        Task.remove({"id": task.id}, function (data) {
            self.tasks = _.filter(self.tasks, function (e) {
                return e.id !== task.id;
            });
        });
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