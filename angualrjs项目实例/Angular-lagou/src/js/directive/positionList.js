'use strict'

angular.module('app').directive('positionList', ['$http', function ($http) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            data: '=', // =: 双向数据绑定  @: 单向数据绑定 &： 绑定函数
            filterObj: '=',
            isFavorite: '='
        },
        templateUrl: 'view/template/positionList.html',
        controller: function ($scope, $element, $attrs) {
            $scope.stateList = {
                "-1": "不合适",
                "0": "被查看",
                "1": "邀请面试",
            };
        },
        link: function (scope, elements, attrs) {
            scope.toggleFavorite = function ($event, item) {
                $event.stopPropagation();
                $http.post('data/favorite.json', {
                    id: item.id,
                    favorite: !item.favorite
                }).then(function (data) {
                    item.favorite = !item.favorite;
                })
            };
            scope.confirmOffer = function($event,item){
                $event.stopPropagation();
                if(item.offer){
                    return;
                }
                $http.post('data/confirmOffer.json', {
                    id: item.id,
                    offer: true
                }).then(function (data) {
                    item.offer = true;
                })
            }
        }
    }
}]);