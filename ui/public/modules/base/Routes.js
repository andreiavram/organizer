var ng = require('angular');

var Router = require('base/Router');

function initialize() {
    "use strict";

    Router.addState({
        name: 'base',
        abstract: true,
        views: {}
    });
}

module.exports = initialize;
