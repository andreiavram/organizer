/**
 * Created by yeti on 02.05.2016.
 */

var Tags = require('tags/Tags');
var _ = require('lodash');
var Tag = require('tags/factories/Tag');
var LuminanceCalculator = require("tags/factories/LuminanceCalculator");


function TagRepository(Tag, LuminanceCalculator) {
    "use strict";

    // get all available tags, once
    // handle available tags on tag add / remove / change
    var tags = Tag.query();
    tags.$promise.then(function(result) {
        _.forEach(tags, function(e) {
            e.luminance = LuminanceCalculator.getColor(e.color);
        });
    });

    return {
        all: function() {
            return tags;
        },
        for_task: function(task) {
            return _.filter(tags, function (e) {
                return _.indexOf(task.tags, e.id) >= 0;
            });
        }
    };
}


Tags.factory("TagRepository", ["Tag", "LuminanceCalculator", TagRepository]);
module.exports = TagRepository;