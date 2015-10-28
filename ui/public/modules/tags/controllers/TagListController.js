/**
 * Created by yeti on 28.10.2015.
 */


var Tags = require("tags/Tags");

require("tags/factories/Tag");
require("tags/factories/LuminanceCalculator");

function TagListController($scope, $location, Tag, LuminanceCalculator) {
    "use strict";
    $scope.tags = Tag.query();

    $scope.calculate_luminance = LuminanceCalculator;

    $scope.remove_tag = function (tag) {
        Tag.remove(tag, function (data) {
            $scope.tags = _.without($scope.tags, tag);
        });
    };

    // TODO: refactor this to use states
    $scope.redirect_to_tasks = function (tag) {
        $location.path("/tasks/tag/" + tag.id);
    };

    // TODO: refactor this to use states
    $scope.redirect_to_form = function (tag) {
        if (tag) {
            $location.path("/tags/" + tag.id + "/update");
        } else {
            $location.path("/tags/create");
        }
    };
}

Tags.controller("TagListController", [
    "$scope",
    "$location",
    "Tag",
    "LuminanceCalculator",

    TagListController
]);

module.exports = TagListController;