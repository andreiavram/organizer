/**
 * Created by andrei on 10/07/14.
 */

var Organizer = angular.module("Organizer", [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

angular.module("Organizer").controller("TaskController", function TaskController($scope) {
    $scope.$watch("task_input", function (data) {
        console.log(data);
    });

    $scope.processEvent = function processEvent(e) {
        console.log(e);
    }
});