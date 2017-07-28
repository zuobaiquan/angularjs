'use strict'

angular.module('app').controller('mainCtrl', ['$scope','$http','cache',function($scope,$http,cache){
    if (cache.get('name')) {
        $scope.isLogin = true;
    } else {
        $scope.isLogin = false;
    }
    $http.get('data/positionList.json').then(function(data){
        $scope.list = data.data;
    }).catch(function(data){
        console.log('网络错误..');
    })
}]);