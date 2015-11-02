/**
 * Created by yeti on 28.10.2015.
 */

var Projects = require("projects/Projects");
var _ = require("lodash");

require("tags/factories/Tag");
require("projects/factories/Project");

function ProjectListController($scope, Tag, Project) {
    "use strict";
    $scope.projects = Project.query();
    $scope.tags = Tag.query();

    $scope.removeProject = function removeProject(project) {
        Project.remove(project, function (data) {
            $scope.projects = _.without($scope.projects, project);
        });
    };
}

Projects.controller("ProjectListController", [
    "$scope",
    "Tag",
    "Project",

    ProjectListController
]);

module.exports = ProjectListController;