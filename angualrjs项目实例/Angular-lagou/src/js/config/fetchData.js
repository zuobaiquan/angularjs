'use strict';

angular.module('app').value('fetchData', {}).run(['fetchData', '$http', function (fetchData, $http) {
    $http.get('data/city.json').then(function (data) {
        fetchData.city = data.data;
    });
    $http.get('data/salary.json').then(function (data) {
        fetchData.salary = data.data;
    });
    $http.get('data/scale.json').then(function (data) {
        fetchData.scale = data.data;
    });
}]);
