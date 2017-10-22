/**
 * Created by yeti on 23.10.2015.
 */

var Auth = require("auth/Auth");

function Session() {
    "use strict";
    this.create = function (token, userId, userRole) {
        this.token = token;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function () {
        this.token = null;
        this.userId = null;
        this.userRole = null;
    };
}

Auth.service('Session', [
    Session
]);

module.exports = new Session();