'use strict'

angular.module('app').directive('loginBar', [function(){
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            isLogin: '='
        },
        templateUrl: 'view/template/loginBar.html'
    }
}]);