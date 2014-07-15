/**
 * Created by andrei on 10/07/14.
 */

var Organizer = angular.module("Organizer", ["ngResource"]);

angular.module("Organizer").config(['$interpolateProvider', '$resourceProvider', '$httpProvider' , function ($interpolateProvider, $resourceProvider, $httpProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $resourceProvider.defaults.stripTrailingSlashes = false;

}]);

angular.module('Organizer').factory('_', ['$window',
      function($window) {
        return $window._;
      }
    ]);

angular.module('Organizer').factory('TaskService', ['$resource', function TaskService($resource) {
        return $resource('/api/tasks/:id/', {
            id: '@id'
        });
    }
]);


angular.module("Organizer").controller("TaskController", ["$scope", "TaskService", function TaskController($scope, TaskService) {
    $scope.new_task = {};

    TaskService.query(function (data) {
        $scope.tasks = data;
    });

    $scope.task_errors = {};

    $scope.process_task = function process_task(e) {
        e.preventDefault();
        if (e.keyCode == 13) {
            TaskService.save($scope.new_task, function(data) {
                $scope.tasks.push(data);
                $scope.new_task = {};
            }, function (data) {
                $scope.task_errors = data.data
            });
        };

        var at_index = $scope.new_task.title.indexOf("@");
        if (at_index != -1) {
            console.log($scope.new_task.title.substring(at_index + 1));
        }
    }

    $scope.remove_task = function remove_task(task) {
        TaskService.remove(task, function(data) {
            $scope.tasks = _.without($scope.tasks, task);
        });
    }
}]);