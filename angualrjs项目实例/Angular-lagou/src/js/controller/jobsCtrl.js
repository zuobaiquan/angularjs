'use strict'

angular.module('app').controller('jobsCtrl', ['$scope', '$http', '$state', '$q', 'cache', function ($scope, $http, $state, $q, cache) {
    $scope.isFavorite = false;

    if (cache.get('name')) {
        $scope.isLogin = true;
    } else {
        $scope.isLogin = false;
    }
    var jobId = $state.params.id;
    $scope.btnText = $scope.isLogin ? '投个简历' : '去登录';
    $scope.jobDelivery = function () {
        if($scope.btnText == '已投递'){
            return;
        }
        if ($scope.isLogin) {
            $http.post('data/handle.json', {id: jobId}).then(function (data) {
                $scope.btnText = '已投递';
            });
        } else {
            $state.go('login');
        }
    }
    $scope.toggleFavorite = function () {
        $scope.isFavorite = !$scope.isFavorite;
    }

    function getPositionList() {
        var def = $q.defer();  // $q处理异步
        $http.get('data/positionList.json').then(function (data) {
            def.resolve(data);
        });
        return def.promise;
    };

    getPositionList().then(function (data) {
        angular.forEach(data.data, function (item, index) {
            if (item.id == jobId) {
                $scope.job = item;
            };
        })
    });

}]);