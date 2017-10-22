var SuperAgent = require('superagent');

var State = require('base/State');
var AuthService = require('auth/services/AuthService');

function Request() {
    this.get = get;
    this.post = post;
    this.put = put;
    this.del = del;
    
    function get(url) {
        return SuperAgent
            .get(url)
            .set('Authorization', AuthService.token)
            .use(checkAuth);
    }
    
    function post(url) {
        return SuperAgent
            .post(url)
            .set('Authorization', AuthService.token)
            .use(checkAuth);
    }
    
    function put(url) {
        return SuperAgent
            .put(url)
            .set('Authorization', AuthService.token)
            .use(checkAuth);
    }
    
    function del(url) {
        return SuperAgent
            .del(url)
            .set('Authorization', AuthService.token)
            .use(checkAuth);
    }
    
    function checkAuth(req) {
        var callback = req.callback;
        req.callback = function(err, res) {
            if(err && err.status === 401) {
                AuthService.token = null;
                State.go('base.auth.login');
            }
            callback.call(req, err, res);
        };
    }
}

module.exports = new Request();
