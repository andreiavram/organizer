var $ = require('jquery');

var Base = require('base/Base');

function ToggleMenu($document) {
    return {
        restrict: 'A',
        scope: {
            isOpen: '=toggleMenu'
        },
        link: function($scope, element) {
            $(element).find('*[toggle-menu-handle]').bind('click', function(e) {
                e.stopPropagation();
                
                $scope.$apply(function() {
                    $scope.isOpen = !$scope.isOpen;
                    
                    if($scope.isOpen) {
                        $scope.$root.$broadcast('toggle-menu-opened', element);
                    }
                });
            });
            
            $document.bind('click', function(e) {
                if($scope.isOpen) {
                    $scope.$apply(function() {
                        $scope.isOpen = false;
                    });
                }
            });
            
            $scope.$on('toggle-menu-opened', function(e, menu) {
                if(menu !== element) {
                    $scope.isOpen = false;
                }
            });
        }
    };
}

Base.directive('toggleMenu', [
    '$document',
    
    ToggleMenu
]);

module.exports = ToggleMenu;
