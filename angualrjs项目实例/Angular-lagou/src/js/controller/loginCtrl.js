'use strict'

angular.module('app').controller('loginCtrl', ['$scope', '$http', '$state', 'cache',function ($scope, $http, $state, cache) {
    $scope.submit = function () {
        $http.post('data/login.json', $scope.user).then(function(data){
            cache.put('id', data.data.id);
            cache.put('name', data.data.name);
            cache.put('avatar', data.data.avatar);
            $state.go('main');
        });
    }
}]);