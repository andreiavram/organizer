var _ = require('lodash');

var State = require('base/State');
var Demo = require('demo/Demo');

function DemoController($scope) {
    var self = this;
    
    this.foo = {
        bar: 'bar',
        baz: 'baz'
    };
}

Demo.controller('DemoController', [
    '$scope',
    
    DemoController
]);

module.exports = DemoController;
