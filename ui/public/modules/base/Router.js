function Router() {
    this.StateProvider = null;
    this.UrlRouterProvider = null;
    
    this.initialize = initialize;
    this.addState = addState;
    
    function initialize(StateProvider, UrlRouterProvider) {
        this.stateProvider = StateProvider;
        this.urlRouterProvider = UrlRouterProvider;
    }
    
    function addState(definition) {
        this.stateProvider.state(definition.name, definition);
        
        if(definition.isDefault) {
            this.urlRouterProvider.otherwise(definition.url);
        }
    }
}

module.exports = new Router();
