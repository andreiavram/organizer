/**
 * Created by yeti on 28.10.2015.
 */

var Projects = require("projects/Projects");

require("tags/factories/Tag");
require("projects/factories/Project");

function ProjectListController($scope, Tag, Project) {
    "use strict";
    $scope.projects = Project.query();
    $scope.tags = Tag.query();
}

Projects.controller("ProjectListController", [
    "$scope",
    "Tag",
    "Project",

    ProjectListController
]);

module.exports = ProjectListController;