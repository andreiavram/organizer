/**
 * Created by yeti on 28.10.2015.
 */


var Tags = require("tags/Tags");

require("tags/factories/Tag");

function TagFormController($scope, $stateParams, $state, Tag) {
    "use strict";
    $scope.tag_id = $stateParams.id || null;
    if ($scope.tag_id) {
        $scope.tag = Tag.get({id: $scope.tag_id});
    }

    function error_handler(result) {
        $scope.errors = result.data;
    }

    $scope.save_tag = function(tag) {
        if ($scope.tag.id) {
            $scope.tag.$update().then(function () {
                $state.go("base.tags.list");
            }, error_handler);
        } else {
            $scope.tag = Tag.save($scope.tag).$promise.then(function () {
                $state.go("base.tags.list");
            }, error_handler);
        }
    };
}

Tags.controller("TagFormController", [
    "$scope",
    "$stateParams",
    "$state",
    "Task",
    "Tag",

    TagFormController
]);


module.exports = TagFormController;