/**
 * Created by andrei on 10/07/14.
 */

var Organizer = angular.module("Organizer", ["ngResource", "ngRoute", "monospaced.elastic", "ngTagsInput", "nl2br", "ngSanitize", "color.picker"]);
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
        text = text.replace(/\n/g, "<br>");
        return text

    };
});

angular.module("Organizer").config(["$routeProvider", function ($routeProvider) {
    $routeProvider.
        when('/tasks', {
            templateUrl: Config.TEMPLATE_URL + 'partials/task-list.html',
            controller: 'TaskListController'
        }).
        when('/tasks/tag/:tag?', {
            templateUrl: Config.TEMPLATE_URL + 'partials/task-list.html',
            controller: 'TaskListController'
        }).
        when('/tasks/:id', {
            templateUrl: Config.TEMPLATE_URL + 'partials/task-detail.html',
            controller: 'TaskDetailController'
        }).
        when('/tags', {
            templateUrl: Config.TEMPLATE_URL + 'partials/tag-list.html',
            controller: 'TagListController'
        }).
        when('/tags/create', {
            templateUrl: Config.TEMPLATE_URL + 'partials/tag-form.html',
            controller: 'TagFormController'
        }).
        when('/tags/:id/update', {
            templateUrl: Config.TEMPLATE_URL + 'partials/tag-form.html',
            controller: 'TagFormController'
        }).
        when('/project', {
            templateUrl: Config.TEMPLATE_URL + 'partials/project-list.html',
            controller: 'ProjectListController'
        }).
        when('/project/:id', {
            templateUrl: Config.TEMPLATE_URL + 'partials/project-detail.html',
            controller: 'ProjectDetailController'
        }).
        otherwise({
            redirectTo: '/tasks'
        })
}]);

angular.module("Organizer").config(['msdElasticConfig', function(msdElasticConfig) {
    msdElasticConfig.append = "\n\n";
}]);

angular.module('Organizer').factory('_', ['$window',
    function($window) {
        return $window._;
    }
]);




angular.module('Organizer').factory('Project', ['$resource', function Project($resource) {
    return $resource(Config.URL_PREFIX + '/api/project/:id/', { id: '@id'},
        {
            update: {
                method: 'PUT'
            }
        })
}]);

angular.module("Organizer").factory("LuminanceCalculator", [function LuminanceCalculator() {
    return function (color) {
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
}]);

angular.module("Organizer").controller("MainNavigation", ["$scope", "$location",
    function MainNavigation($scope, $location) {
        $scope.menuClass = function (page) {
            var current = $location.path().substring(1).split("/")[0];
            return page === current ? "active" : "";
        }
    }]);

angular.module("Organizer").controller("TagListController", ["$scope", "$routeParams", "$location", "Tag", "LuminanceCalculator",
    function TagListController($scope, $routeParams, $location, Tag, LuminanceCalculator) {
        $scope.tags = Tag.query();

        $scope.calculate_luminance = LuminanceCalculator;

        $scope.remove_tag = function (tag) {
            Tag.remove(tag, function (data) {
                $scope.tags = _.without($scope.tags, tag);
            })
        };

        $scope.redirect_to_tasks = function (tag) {
            $location.path("/tasks/tag/" + tag.id)
        };

        $scope.redirect_to_form = function (tag) {
            if (tag) {
                $location.path("/tags/" + tag.id + "/update");
            } else {
                $location.path("/tags/create");
            }
        };
    }]);



angular.module("Organizer").controller("ProjectListController", ["$scope", "$routeParams", "$location", "$filter", "Task", "Tag", "Project",
    function ProjectListController($scope, $routeParams, $location, $filter, Task, Tag, Project) {
        $scope.projects = Project.query();
        $scope.tags = Tag.query();

        $scope.redirect_to = function (project) {
            $location.path('project/' + project.id);
        }
    }]);

angular.module("Organizer").controller("ProjectDetailController", ["$scope", "$routeParams", "$location", "$filter", "Task", "Tag", "Project",
    function ProjectDetailController($scope, $routeParams, $location, $filter, Task, Tag, Project) {
        $scope.project_id = $routeParams.id;
        $scope.project = Project.get({id: $scope.project_id});
        $scope.mode = "view";
        $scope.new_task = {};

        $scope.save_project_task = function () {
            $scope.new_task.project = $scope.project_id;
            Task.save($scope.new_task, function (data) {
                $scope.new_task = {};
                $scope.project.tasks.push(data);
            })
        }

    }]);


angular.module("Organizer").controller("TagFormController", ["$scope", "$routeParams", "$location", "Task", "Tag",
    function TagFormController($scope, $routeParams, $location, Task, Tag) {
        $scope.tag_id = $routeParams.id || null;
        if ($scope.tag_id) {
            $scope.tag = Tag.get({id: $scope.tag_id});
        }

        function error_handler(result) {
            $scope.errors = result.data;
        }

        $scope.save_tag = function(tag) {
            if ($scope.tag.id) {
                $scope.tag.$update().then(function () {
                    $location.path("/tags")
                }, error_handler);
            } else {
                $scope.tag = Tag.save($scope.tag).$promise.then(function () {
                    $location.path("/tags");
                }, error_handler);
            }


        }
    }]);
