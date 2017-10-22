/**
 * Created by yeti on 23.10.2015.
 */

var Auth = require("auth/Auth");

Auth.config(function ($httpProvider) {
    "use strict";
    $httpProvider.interceptors.push([
        "$injector",
        function ($injector) {
            return $injector.get("AuthInterceptor");
        }
    ]);
});
