var ng = require('angular');

var Router = require('base/Router');
var DemoController = require('demo/controllers/DemoController');

function initialize() {
    Router.addState({
        name: 'base.demo',
        url: '/demo',
        // isDefault: true,
        views: {
            'demo@': {
                templateUrl: '/static/demo/templates/demo.html',
                controller: DemoController,
                controllerAs: 'demo'
            }
        }
    });
}

module.exports = initialize;
