var ng = require('angular');

function RootScope() {
    var self = this;
    
    var $rootScope;
    
    this.apply = apply;
    
    initialize();
    
    function initialize() {
        ng.element(document).ready(function() {
            $rootScope = ng.element(document.body).injector().get('$rootScope');
        });
    }
    
    function apply(context) {
        if(!$rootScope.$$phase) {
            $rootScope.$apply(context);
        }
    }
}

module.exports = new RootScope();
