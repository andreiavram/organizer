/**
 * Created by andrei on 10/07/14.
 */

var Organizer = angular.module("Organizer", ["ngResource", "ngRoute", "monospaced.elastic", "ngTagsInput", "nl2br", "ngSanitize"]);
var Config = Config || {};

angular.module("Organizer").config(['$interpolateProvider', '$resourceProvider', '$httpProvider' , function ($interpolateProvider, $resourceProvider, $httpProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $resourceProvider.defaults.stripTrailingSlashes = false;

}]);

angular.module("Organizer").filter('parseUrlFilter', function () {
    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
    return function (text, target) {
        if (!text) return "";
        text = text.replace(urlPattern, '<a target="' + target + '" href="$&">$&</a>');
        text = text.replace(/\n/g, "<br>")
        return text

    };
});

angular.module("Organizer").config(["$routeProvider", function ($routeProvider) {
    $routeProvider.
        when('/tasks', {
            templateUrl: Config.TEMPLATE_URL + 'partials/task-list.html',
            controller: 'TaskListController'
        }).
        when('/task/:id', {
            templateUrl: Config.TEMPLATE_URL + 'partials/task-detail.html',
            controller: 'TaskDetailController'
        }).
        otherwise({
            redirectTo: '/tasks'
        })
}]);

angular.module("Organizer").config(['msdElasticConfig', function(msdElasticConfig) {
    msdElasticConfig.append = "\n\n";
}])

angular.module('Organizer').factory('_', ['$window',
    function($window) {
        return $window._;
    }
]);

angular.module('Organizer').factory('Task', ['$resource', function Task($resource) {
    return $resource(Config.URL_PREFIX + '/api/task/:id/', { id: '@id'},
        {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        });
}
]);

angular.module('Organizer').factory('Tag', ['$resource', function Tag($resource) {
    return $resource(Config.URL_PREFIX + '/api/tag/:id/', { id: '@id'},
        {
            update: {
                method: 'PUT'
            }
        })
}]);

angular.module("Organizer").controller("TaskListController", ["$scope", "$routeParams", "$location", "Task", "Tag",
    function TaskListController($scope, $routeParams, $location, Task, Tag) {
        $scope.new_task = {};

        $scope.tasks = Task.query();
        $scope.tags = Tag.query();
        $scope.search_tags = [];
        $scope.task_errors = {};
        $scope.show_completed = true;

        $scope.mode = 'add';
        $scope.mode_names = {search : "Caută", add: "Adaugă"}

        $scope.refresh_tasks = function () {
            $scope.tasks = Task.query({tags: _.pluck($scope.search_tags, "id"), query: $scope.query, completed: !$scope.show_completed});
        };

        $scope.$watchCollection("tasks", function (n, o) {
            $scope.tasks = _.sortBy($scope.tasks, "changed_date").reverse();
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
            $location.path('task/' + task.id);
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

        $scope.calculate_luminance = function (color) {
            color = color || "#000000";
            var number_color = parseInt(color.slice(1), 16);
            var r = (number_color & 0xff0000) >> 16;
            var g = (number_color & 0xff00) >> 8;
            var b = (number_color & 0xff);
            if ((r * 0.299 + g * 0.587 + b * 0.114) / 256. < 0.5) {
                return "#FFFFFF";
            } else {
                return "#000000";
            };
        };

        $scope.remove_tag_from_search = function (tag) {
            var tag_ids = _.pluck($scope.search_tags, "id");
            if (_.indexOf(tag_ids, tag.id) >= 0) {
                $scope.search_tags = _.reject($scope.search_tags, {"id" : tag.id});
            }
        }

        $scope.add_tag_to_search = function (tag) {
            var tag_ids = _.pluck($scope.search_tags, "id");
            if (_.indexOf(tag_ids, tag.id) < 0) {
                $scope.search_tags.push(tag);
            }
        }
    }]);

angular.module("Organizer").controller("TaskDetailController", ["$scope", "$routeParams", "$location", "$filter", "Task", "Tag",
    function TaskDetailController($scope, $routeParams, $location, $filter, Task, Tag) {
        $scope.mode = 'view';
        $scope.task_id = $routeParams.id;

        $scope.process_task_from_server = function () {
            $scope.load_tags().then(function (tags) {
                $scope.task.tags = _.filter(tags, function (e) { return _.indexOf($scope.task.tags, e.id) >= 0 });
                $scope.tags = $scope.task.tags
            });
        };

        $scope.process_task_for_server = function () {
            $scope.task.tags = _.pluck($scope.task.tags, "id");
        };

        $scope.task = Task.get({id: $scope.task_id});
        $scope.task.$promise.then(function(data){
            $scope.process_task_from_server()
        });

        $scope.calculate_luminance = function (color) {
            color = color || "#000000";
            var number_color = parseInt(color.slice(1), 16);
            var r = (number_color & 0xff0000) >> 16;
            var g = (number_color & 0xff00) >> 8;
            var b = (number_color & 0xff);
            if ((r * 0.299 + g * 0.587 + b * 0.114) / 256. < 0.5) {
                return "#FFFFFF";
            } else {
                return "#000000";
            };
        };

        $scope.task_errors = {};

        $scope.remove_task = function remove_task() {
            $scope.task.$delete().then(function () {
                $location.path('tasks/');
            })
        };

        $scope.toggle_mode = function toggle_mode() {
            if ($scope.mode == 'view') {
                $scope.mode = 'edit';
            } else {
                $scope.update_task(function () {
                    $scope.mode = 'view';
                })
            }
        };

        $scope.load_tags = function load_tags(query) {
            return Tag.query({slug: query}).$promise
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
            }[$scope.task.priority]
        };

        $scope._toggle_priority = function () {
            $scope.task.priority = $scope.task.priority * 2;
            if ($scope.task.priority > 4) {
                $scope.task.priority = 1;
            }

            $scope.update_task()
        };

        $scope.toggle_priority = _.debounce($scope._toggle_priority, 500);


    }]);