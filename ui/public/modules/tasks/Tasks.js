/**
 * Created by yeti on 20.10.2015.
 */
var ng = require('angular');
var Resource = require('angular-resource');
var OrganizerSetup = require("base/Setup");

var Tasks = ng.module('Tasks', [Resource, ])
    .config([
        '$interpolateProvider',
        '$resourceProvider',
        '$httpProvider',

        OrganizerSetup
    ]);


module.exports = Tasks;
