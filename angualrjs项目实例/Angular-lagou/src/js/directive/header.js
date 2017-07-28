'use strict'

angular.module('app').directive('appHeader', [function(){
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        scope:{
            showBack: '=',
            showHome: '='
        },
        templateUrl: 'view/template/header.html',
        link: function(scope,elements,attrs){
            scope.back = function(){
                window.history.back();
            };
        }
    }
}]);