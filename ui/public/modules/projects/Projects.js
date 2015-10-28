/**
 * Created by yeti on 20.10.2015.
 */
var ng = require('angular');
var Resource = require('angular-resource');
var Sanitize = require('angular-sanitize');
var OrganizerSetup = require("base/Setup");
var TagsInput = require('ng-tags-input');
var ColorPicker = require("angular-color-picker");
var Elastic = require("angular-elastic");


var Projects = ng.module('Projects', [Resource, Sanitize, "mp.colorPicker", "ngTagsInput"])
    .config([
        '$interpolateProvider',
        '$resourceProvider',
        '$httpProvider',
        'msdElasticConfig',

        OrganizerSetup
    ]);


module.exports = Projects;
