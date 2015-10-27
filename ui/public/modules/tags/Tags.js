/**
 * Created by yeti on 20.10.2015.
 */
var ng = require('angular');
var Resource = require('angular-resource');
var OrganizerSetup = require("base/Setup");

var Tags = ng.module('Tags', [Resource])
    .config([
        '$interpolateProvider',
        '$resourceProvider',
        '$httpProvider',

        OrganizerSetup
    ]);

module.exports = Tags;
