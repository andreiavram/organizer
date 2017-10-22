var ng = require('angular');

var Router = require('base/Router');
var AuthResolver = require("auth/services/AuthResolver");
var ProjectListController = require("projects/controllers/ProjectListController");
var ProjectDetailController = require("projects/controllers/ProjectDetailController");
var ProjectEditController = require("projects/controllers/ProjectEditController");

function initialize() {
    "use strict";
    Router.addState({
        name: 'base.projects',
        abstract: true,
        views: {}
    });

    Router.addState({
        name: 'base.projects.list',
        url: '/projects',
        isDefault: true,
        views: {
            'main@': {
                templateUrl: '/static/projects/templates/project-list.html',
                controller: ProjectListController
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
        name: 'base.projects.detail',
        url: '/projects/{id:int}/',
        isDefault: false,
        views: {
            'main@': {
                templateUrl: '/static/projects/templates/project-detail.html',
                controller: ProjectDetailController
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
        name: 'base.projects.create',
        url: '/projects/create/',
        isDefault: false,
        views: {
            'main@': {
                templateUrl: '/static/projects/templates/project-form.html',
                controller: ProjectEditController
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
        name: 'base.projects.edit',
        url: '/projects/{id:int}/edit/',
        isDefault: false,
        views: {
            'main@': {
                templateUrl: '/static/projects/templates/project-form.html',
                controller: ProjectEditController
            }
        },
        resolve: {
            //auth: function resolveAuthentication(AuthResolver) {
            //    "use strict";
            //    return AuthResolver.resolve();
            //}
        }
    });
}

module.exports = initialize;
