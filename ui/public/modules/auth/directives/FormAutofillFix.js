/**
 * Created by yeti on 23.10.2015.
 */

var Auth = require("auth/Auth");

function formAutofillFix($timeout) {
    "use strict";
    return function (scope, element, attrs) {
        element.prop('method', 'post');
        if (attrs.ngSubmit) {
            $timeout(function () {
                element
                    .unbind('submit')
                    .bind('submit', function (event) {
                        event.preventDefault();
                        element
                            .find('input, textarea, select')
                            .trigger('input')
                            .trigger('change')
                            .trigger('keydown');
                        scope.$apply(attrs.ngSubmit);
                    });
            });
        }
    };
}

Auth.directive('formAutofillFix', formAutofillFix);
