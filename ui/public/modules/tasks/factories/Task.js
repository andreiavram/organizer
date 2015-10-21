/**
 * Created by yeti on 20.10.2015.
 */

var _ = require('lodash');

var Config = require('base/Config');
var Promise = require('base/Promise');

function Task($resource) {
    return $resource(Config.URL_PREFIX + '/api/task/:id/', { id: '@id'},
        {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        });
}

angular.module('Organizer').factory('Task', [
    '$resource',

    Task
]);


module.exports = Task;