/**
 * Created by yeti on 23.10.2015.
 */

var Auth = require("auth/Auth");

var USER_ROLES = {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
};

Auth.constant('USER_ROLES', USER_ROLES);

module.exports = USER_ROLES;
