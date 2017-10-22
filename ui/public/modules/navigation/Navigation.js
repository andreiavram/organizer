/**
 * Created by yeti on 27.10.2015.
 */

var ng = require('angular');
var OrganizerSetup = require("base/Setup");

var Navigation = ng.module('Navigation', [])
    .config([
        '$interpolateProvider',
        '$resourceProvider',
        '$httpProvider',

        OrganizerSetup
    ]);

module.exports = Navigation;
