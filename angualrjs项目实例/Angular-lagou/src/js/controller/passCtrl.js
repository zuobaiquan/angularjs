'use strict'

angular.module('app').controller('passCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.filterObj = {'passState':'1'};
    $scope.tabList = [{
        id: 'had',
        name: '已面试'
    }, {
        id: 'will',
        name: '将面试'
    }];
    $scope.selectId = "had";

    $http.get('data/myPass.json').then(function (data) {
        $scope.postList = data.data;
    })

    $scope.tabClick = function (id, name) {
        switch (id) {
            case 'had':
                $scope.filterObj.passState = '1';
                break;
            case 'will':
                $scope.filterObj.passState = '0';
                break;
            default:

        }
    }
}]);