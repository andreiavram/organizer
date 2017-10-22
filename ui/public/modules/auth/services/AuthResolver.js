/**
 * Created by yeti on 23.10.2015.
 */

var Auth = require("auth/Auth");

function AuthResolver($q, $rootScope, $state) {
    return {
        resolve: function () {
            var deferred = $q.defer();
            var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
                if (angular.isDefined(currentUser)) {
                    if (currentUser) {
                        deferred.resolve(currentUser);
                    } else {
                        deferred.reject();
                        $state.go('base.auth.login');
                    }
                    unwatch();
                }
            });
            return deferred.promise;
        }
    };
}

Auth.factory('AuthResolver', [
    "$q",
    "$rootScope",
    "$state",

    AuthResolver
]);

module.exports = AuthResolver;