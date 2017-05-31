var app = angular.module('myApp',[])
.directive("comstomTags",function(){
    return {
        restrict:'ECAM',
        templateUrl:'./tpl.html',
        replace:true
    }
})
.directive("comstomTags2",function(){
    return {
        restrict:'ECAM',
        templateUrl:'comstomTags2',
        replace:true
    }
})
.controller('firstController', function ($scope) {
    $scope.name='zuobaiquan';
});