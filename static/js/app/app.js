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
    return $resource('/api/answer/:id/', {
        id: '@id'
    }, {
        add_task: {
            method: 'POST',
            url: '/api/task/'
        }
    });
}]);


angular.module("Organizer").controller("TaskController", ["$scope", "TaskService", function TaskController($scope, TaskService) {
    $scope.$watch("task_input", function (data) {
        console.log(data);
    });

    $scope.tasks = [
        {
            title: "mail idei strategie",
            id: 1,
            user: "yeti"
        }

    ]

    $scope.processTask = function processTask(e) {
        if (e.keyCode == 13) {
            $scope.tasks.push({
                id: null,
                title: $scope.task_input,
                user: "yeti"
            });
            $scope.task_input = "";
        }
        e.preventDefault();
    }
}]);