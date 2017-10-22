/**
 * Created by yeti on 28.10.2015.
 */


var Tags = require("tags/Tags");

require("tags/factories/Tag");
require("tags/factories/TagRepository");

function TagListController($scope, $state, Tag, TagRepository) {
    "use strict";
    $scope.tags = TagRepository.all();

    $scope.remove_tag = function (tag) {
        Tag.remove(tag, function (data) {
            $scope.tags = _.without($scope.tags, tag);
        });
    };

    // TODO: refactor this to use states
    $scope.redirect_to_tasks = function (tag) {
        $location.path("/tasks/tag/" + tag.id);
    };

    $scope.redirect_to_form = function (tag) {
        return tag ? $state.go("base.tags.detail", {id: tag.id}) : $state.go("base.tags.create");
    };
}

Tags.controller("TagListController", [
    "$scope",
    "$state",
    "Tag",
    "TagRepository",

    TagListController
]);

module.exports = TagListController;