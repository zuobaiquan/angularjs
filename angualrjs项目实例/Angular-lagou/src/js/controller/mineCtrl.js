'use strict'

angular.module('app').controller('mineCtrl', ['$scope', 'cache', '$state', function ($scope, cache, $state) {
    if (cache.get('name')) {
        $scope.isLogin = true;
        $scope.name = cache.get('name');
        $scope.avatar = cache.get('avatar');
    } else {
        $scope.isLogin = false;
        $scope.avatar = '/image/default_portrait.png';
    }

    $scope.goPost = function($event){
        $event.stopPropagation();
        if($scope.isLogin){
            $state.go('post');
        } else {
            $state.go('login');
        }
    }
    $scope.goPass = function($event){
        $event.stopPropagation();
        if($scope.isLogin){
            $state.go('pass');
        } else {
            $state.go('login');
        }
    }
    $scope.goFavor = function($event){
        $event.stopPropagation();
        if($scope.isLogin){
            $state.go('favorite');
        } else {
            $state.go('login');
        }
    }

    $scope.logout = function ($event) {
        $event.stopPropagation();
        cache.remove('id');
        cache.remove('name');
        cache.remove('avatar');
        // $state.go('main');
        $state.reload();
    };
}]);