/**
 * Created by yeti on 23.10.2015.
 */

var Auth = require("auth/Auth");

var AUTH_EVENTS = {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
};

Auth.constant('AUTH_EVENTS', AUTH_EVENTS);

module.exports = AUTH_EVENTS;