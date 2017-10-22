var ng = require('angular');

function State() {
    var self = this;
    var stateService;
    var stateParamsService;
    
    this.go = go;
    this.params = params;
    
    initialize();
    
    function initialize() {
        ng.element(document).ready(function() {
            stateService = ng.element(document.body).injector().get('$state');
            stateParamsService = ng.element(document.body).injector().get('$stateParams');
        });
    }
    
    function go(path, params) {
        return stateService.go(path, params);
    }
    
    function params() {
        return stateParamsService;
    }
}

module.exports = new State();
