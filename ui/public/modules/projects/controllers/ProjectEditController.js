/**
 * Created by yeti on 02.11.2015.
 */

var Projects = require("projects/Projects");
var _ = require("lodash");

require("projects/factories/Project");
require("tags/factories/Tag");
require("angular-bootstrap");

function ProjectEditController($scope, $stateParams, $state, Project, Tag) {
    "use strict";

    $scope.project = {};
    $scope.mode = "create";
    if ($stateParams.id !== undefined) {
        $scope.project = Project.get({id: $stateParams.id});
        $scope.mode = "edit";
    }

    $scope.updateProject = function() {
        console.log($scope.project);
        if ($scope.project.id) {
            Project.update($scope.project);
        } else {
            Project.save($scope.project);
        }

        $state.go("base.projects.list");
    };

    $scope.load_tags = function load_tags(query) {
        return Tag.query({slug: query}).$promise;
    };

    $scope.open = function($event, index) {
        $scope.status[index].opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.status = [{
        opened: false
    }, {
        opened: false
    }];

    $scope.format = 'dd.MM.yyyy';



}


Projects.controller("ProjectEditController", [
    "$scope",
    "$stateParams",
    "$state",
    "Project",
    "Task",
    "Tag",

    ProjectEditController
]);

module.exports = ProjectEditController;
