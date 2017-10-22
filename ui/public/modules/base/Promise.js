var BasePromise = require('promise');
var RootScope = require('base/RootScope');

function Promise(handler) {
    var self = this;
    
    var bp = new BasePromise(handler);
    
    self.onSuccess = null;
    self.onError = null;
    
    bp.then(
        function(data) {
            if(self.onSuccess) {
                RootScope.apply(function() {
                    self.onSuccess(data);
                });
            }
        },
        function(error) {
            if(self.onError) {
                RootScope.apply(function() {
                    self.onError(error);
                });
            }
        }
    );
    
    return {
        then: then
    };
    
    function then(onSuccess, onError) {
        self.onSuccess = onSuccess;
        self.onError = onError;
        
        return bp;
    }
}

module.exports = Promise;