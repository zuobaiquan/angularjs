'use strict'

angular.module('app').directive('appFooter', [function(){
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'view/template/footer.html'
    }
}]);