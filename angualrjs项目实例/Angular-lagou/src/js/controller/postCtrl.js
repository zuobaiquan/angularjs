'use strict'

angular.module('app').controller('postCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.filterObj = {};
    $scope.tabList = [{
        id: 'all',
        name: '全部'
    }, {
        id: 'pass',
        name: '邀请面试'
    }, {
        id: 'fail',
        name: '不合适'
    }];
    $scope.selectId = "all";

    $http.get('data/myPost.json').then(function (data) {
        $scope.postList = data.data;
    })

    $scope.tabClick = function (id, name) {
        switch (id) {
            case 'all':
                delete $scope.filterObj.state;
                break;
            case 'pass':
                $scope.filterObj.state = '1';
                break;
            case 'fail':
                $scope.filterObj.state = '-1';
                break;
            default:

        }
    }
}]);