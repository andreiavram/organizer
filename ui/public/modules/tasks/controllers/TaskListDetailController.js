/**
 * Created by yeti on 20.10.2015.
 */

var _ = require('lodash');

var State = require('base/State');
var Tasks = require('tasks/Tasks');

var Task = require('tasks/factories/Task');
var Tag = require('tags/factories/Tag');

var TagRepository = require('tags/factories/TagRepository');

function TaskListDetailController($scope, $stateParams, $location, Task, Tag, TagRepository) {
    "use strict";

    this.task = {
        priority_icon: "",
        state_icon: "",
        tag_objs: []
    };


    this.set_task = function(task) {
        this.task = task;
        this.task.priority_icon = this.task_priority_icon();
        this.task.state_icon = this.task_state_icon();
        this.task.tag_objs = TagRepository.for_task(this.task);
    };

    this.task_state_icon = function task_state_icon() {
        return {
            "idea": "fa-lightbulb-o",
            "inprogress": "fa-cogs",
            "blocked": "fa-exclamation-triangle",
            "givenup": "fa-trash-o"
        }[this.task.status];
    };

    this.task_priority_icon = function task_priority_icon() {
        return {
            1: "fa-arrow-circle-down yellow",
            4: "fa-arrow-circle-up red", 2: ""
        }[this.task.priority];
    };

    this.toggle_completed = function toggle_completed() {
        this.task.completed = !this.task.completed;
        this.task.$update();
    };
}

Tasks.controller("TaskListDetailController", [
    "$scope",
    "$stateParams",
    "$location",
    "Task",
    "Tag",
    "TagRepository",
    TaskListDetailController
]);

module.exports = TaskListDetailController;