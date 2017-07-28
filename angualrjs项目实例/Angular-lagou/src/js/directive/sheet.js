'use strict'

angular.module('app').directive('sheet', [function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            list: '=',
            showSheet: '=',
            select: '&'
        },
        templateUrl: 'view/template/sheet.html'
    }
}]);