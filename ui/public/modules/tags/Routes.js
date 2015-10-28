var ng = require('angular');

var Router = require('base/Router');
var AuthResolver = require("auth/services/AuthResolver");
var TagListController = require("tags/controllers/TagListController");
var TagFormController = require("tags/controllers/TagFormController");

function initialize() {
    "use strict";
    Router.addState({
        name: 'base.tags',
        abstract: true,
        views: {}
    });

    Router.addState({
        name: 'base.tags.list',
        url: '/tags',
        isDefault: true,
        views: {
            'main@': {
                templateUrl: '/static/tags/templates/tag-list.html',
                controller: TagListController
                // controllerAs: 'demo'
            }
        },
        resolve: {
            //auth: function resolveAuthentication(AuthResolver) {
            //    "use strict";
            //    return AuthResolver.resolve();
            //}
        }
    });

    Router.addState({
        name: 'base.tags.detail',
        url: '/tags/{id:int}/',
        isDefault: false,
        views: {
            'main@': {
                templateUrl: '/static/tags/templates/tags-form.html',
                controller: TagFormController
            }
        }
    });
}

module.exports = initialize;
