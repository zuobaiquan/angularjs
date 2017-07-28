'use strict'

angular.module('app').controller('registerCtrl', ['$scope', '$http', '$interval', '$state', function ($scope, $http, $interval, $state) {
    var interval;
    $scope.submit = function () {
        $http.post('data/regist.json', $scope.user).then(function(data) {
            $state.go('login');
        });
    };
    $scope.send = function () {
        if ($scope.time) {
            return;
        }
        $http.get('data/code.json').then(function (data) {
            if (1 === data.data.state) {
                var waitTime = 60;
                $scope.time = waitTime + 's';
                interval = $interval(function () {
                    if (waitTime <= 0) {
                        $interval.cancel(interval);
                        $scope.time = '';
                    } else {
                        waitTime--;
                        $scope.time = waitTime + 's';
                    }
                }, 1000);
            }
        });
    };
    // 离开页面时清除所有定时器
    $scope.$on("$destroy", function () {
        $interval.cancel(interval);
    })
}]);