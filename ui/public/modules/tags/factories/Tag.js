/**
 * Created by yeti on 20.10.2015.
 */

var Tags = require('tags/Tags');

function Tag($resource) {
    return $resource(Config.URL_PREFIX + '/api/tag/:id/', { id: '@id'},
        {
            update: {
                method: 'PUT'
            }
        })
}

Tags.factory('Tag', [
    '$resource',

    Tag
]);


module.exports = Tag;