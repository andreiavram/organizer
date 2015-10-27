/**
 * Created by yeti on 20.10.2015.
 */

var _ = require('lodash');

var Config = require('base/Config');
var Promise = require('base/Promise');

var Tasks = require('tasks/Tasks');

function Task($resource) {
    return $resource(Config.URL_PREFIX + '/api/task/:id/', { id: '@id'},
        {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        });
}

Tasks.factory('Task', [
    '$resource',
    Task
]);


module.exports = Task;