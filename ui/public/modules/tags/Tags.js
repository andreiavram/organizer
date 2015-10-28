/**
 * Created by yeti on 20.10.2015.
 */
var ng = require('angular');
var Resource = require('angular-resource');
var OrganizerSetup = require("base/Setup");
var Sanitize = require('angular-sanitize');
var TagsInput = require('ng-tags-input');
var ColorPicker = require("angular-color-picker");

var Tags = ng.module('Tags', [Resource, Sanitize, "mp.colorPicker", "ngTagsInput"])
    .config([
        '$interpolateProvider',
        '$resourceProvider',
        '$httpProvider',
        'msdElasticConfig',

        OrganizerSetup
    ]);

module.exports = Tags;
