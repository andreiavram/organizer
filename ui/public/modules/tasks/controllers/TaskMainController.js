/**
 * Created by yeti on 20.10.2015.
 */

var _ = require('lodash');

var State = require('base/State');
var Tasks = require('tasks/Tasks');
var Task = require('tasks/factories/Task');
var Tag = require('tags/factories/Tag');
var TagRepository = require('tags/factories/TagRepository');

function TaskMainController($scope, $stateParams, $location, Task, Tag, TagRepository) {
    "use strict";
    $scope.new_task = {};
    $scope.single_tag = $stateParams.tag || null;

    if ($scope.single_tag) {
        Tag.get({"id": $scope.single_tag}).$promise.then(function (response) {
            $scope.search_tags.push(response);
        });
    }

    $scope.tasks = Task.query();
    $scope.tags = TagRepository.all();

    $scope.search_tags = [];
    if ($scope.single_tag) {
        $scope.search_tags.push();
    }
    $scope.task_errors = {};
    $scope.show_completed = false;

    $scope.mode = 'add';
    $scope.mode_names = {search : "Caută", add: "Adaugă"};

    $scope.refresh_tasks = function () {
        $scope.tasks = Task.query({tags: _.pluck($scope.search_tags, "id"), query: $scope.query, completed: !$scope.show_completed});
    };

    $scope.toggle_general_completed = function () {
        $scope.show_completed = !$scope.show_completed;
        $scope.refresh_tasks();
    };

    $scope.process_search = function (e) {
        $scope.refresh_tasks();
    };

    $scope.unsolved_tasks = function unsolved_tasks() {
        return _.filter(this.tasks, function (e) { return !e.completed; }).length;
    };

    $scope.$watchCollection("search_tags", function (n, o) {
        $scope.refresh_tasks();
    });

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

            Task.save($scope.new_task, function (data) {
                $scope.tasks.unshift(data);
                $scope.new_task = {};
            }, function (data) {
                $scope.task_errors = data.data;
            });
        }

        var at_index = $scope.new_task.title.indexOf("@");
    };
    
    $scope.remove_tag_from_search = function (tag) {
        var tag_ids = _.pluck($scope.search_tags, "id");
        if (_.indexOf(tag_ids, tag.id) >= 0) {
            $scope.search_tags = _.reject($scope.search_tags, {"id" : tag.id});
        }
    };

    $scope.add_tag_to_search = function (tag) {
        var tag_ids = _.pluck($scope.search_tags, "id");
        if (_.indexOf(tag_ids, tag.id) < 0) {
            $scope.search_tags.push(tag);
        }
    };
}

Tasks.controller("TaskMainController", [
    "$scope",
    "$stateParams",
    "$location",
    "Task",
    "Tag",
    "TagRepository",
    TaskMainController
]);

module.exports = TaskMainController;