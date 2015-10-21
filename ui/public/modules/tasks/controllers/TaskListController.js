/**
 * Created by yeti on 20.10.2015.
 */

var _ = require('lodash');

var State = require('base/State');
var Tasks = require('tasks/Tasks');

var Task = require('tasks/factories/Task');
var Tag = require('tasks/factories/Tag');

function TaskListController($scope, $routeParams, $location, Task, Tag, LuminanceCalculator) {
    $scope.new_task = {};
    $scope.single_tag = $routeParams.tag || null;

    if ($scope.single_tag) {
        Tag.get({"id": $scope.single_tag}).$promise.then(function (response) {
            $scope.search_tags.push(response)
        });
    }

    $scope.tasks = Task.query();
    $scope.tags = Tag.query();
    $scope.search_tags = [];
    if ($scope.single_tag) {
        $scope.search_tags.push()
    }
    $scope.task_errors = {};
    $scope.show_completed = false;

    $scope.mode = 'add';
    $scope.mode_names = {search : "Caută", add: "Adaugă"};

    $scope.refresh_tasks = function () {
        $scope.tasks = Task.query({tags: _.pluck($scope.search_tags, "id"), query: $scope.query, completed: !$scope.show_completed});
    };

    $scope.$watchCollection("tasks", function (n, o) {
        if ($scope.tasks.$resolved) {
            $scope.tasks = _.sortBy($scope.tasks, "changed_date").reverse();
        }
    });

    $scope.toggle_general_completed = function () {
        $scope.show_completed = !$scope.show_completed;
        $scope.refresh_tasks();
    };

    $scope.process_search = function (e) {
        $scope.refresh_tasks();
    };

    $scope.$watchCollection("search_tags", function (n, o) {
        $scope.refresh_tasks();
    });

    $scope.process_task = function process_task(e) {
        e.preventDefault();
        if (e.keyCode == 13) {
            var re_tags = /@tags\(([\w+\-, ]+)\)/i;
            var res = $scope.new_task.title.match(re_tags);
            if (res) {
                var tag_list = _.map(res[1].split(","), function(e) { return e.trim() });
                $scope.new_task.tags = _.pluck(_.filter($scope.tags, function (e) {
                    return _.indexOf(tag_list, e.slug) >= 0
                }), "id");

                $scope.new_task.title = $scope.new_task.title.replace(res[0], "");
            }

            Task.save($scope.new_task, function (data) {
                $scope.tasks.push(data);
                $scope.refresh_tasks();
                $scope.new_task = {};
            }, function (data) {
                $scope.task_errors = data.data
            });
        }

        var at_index = $scope.new_task.title.indexOf("@");
    };

    $scope.remove_task = function remove_task(task) {
        Task.remove(task, function (data) {
            $scope.tasks = _.without($scope.tasks, task);
        });
    };

    $scope.task_state_icon = function task_state_icon(task) {
        return {
            "idea": "fa-lightbulb-o",
            "inprogress": "fa-cogs",
            "blocked": "fa-exclamation-triangle",
            "givenup": "fa-trash-o"
        }[task.status]
    };

    $scope.task_priority_icon = function task_priority_icon(task) {
        return {
            1: "fa-arrow-circle-down yellow",
            4: "fa-arrow-circle-up red", 2: ""
        }[task.priority]
    };

    $scope.redirect_to = function redirect_to(task) {
        $location.path('tasks/' + task.id);
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

    $scope.calculate_luminance = LuminanceCalculator;

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
    }
}

Tasks.controller("TaskListController", [
    "$scope",
    "$routeParams",
    "$location",
    "Task",
    "Tag",
    "LuminanceCalculator",

    TaskListController
]);

module.exports = TaskListController;