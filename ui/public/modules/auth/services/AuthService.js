var Request = require('superagent');
var _ = require('lodash');
var Cookies = require('cookies-js');

var Config = require('base/Config');
var Promise = require('base/Promise');

function AuthService() {
    var self = this;
    
    this.login = login;
    this.token = Cookies.get('auth-token');
    
    function login(credentials) {
        return new Promise(function(resolve, reject) {
            Request
                .post(Config.LOGIN_API_URI)
                .send(credentials)
                .end(function(err, res) {
                    if(err) {
                        reject(err);
                    }
                    else if(res.body.key) {
                        self.token = 'Token ' + res.body.key;
                        Cookies.set('auth-token', self.token);
                        resolve(res.body.key);
                    }
                    else {
                        reject('No token returned!');
                        Cookies.expire('auth-token');
                    }
                });
        });
    }
}

module.exports = new AuthService();
