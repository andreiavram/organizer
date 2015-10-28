/**
 * Created by yeti on 28.10.2015.
 */

var Projects = require("projects/Projects");
var Config = require("base/Config");

var Project = Projects.factory('Project', ['$resource', function Project($resource) {
    "use strict";
    return $resource(Config.URL_PREFIX + '/api/project/:id/', { id: '@id'},
        {
            update: {
                method: 'PUT'
            }
        });
}]);

module.exports = Project;