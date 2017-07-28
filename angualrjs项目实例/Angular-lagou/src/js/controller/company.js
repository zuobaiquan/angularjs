'use strict'

angular.module('app').controller('companyCtrl', ['$scope','$http','$state',function($scope,$http,$state){

    var companyId = $state.params.id;
    $scope.posList = [];
    
    $http.get('data/positionList.json').then(function(data){
        angular.forEach(data.data,function(item,index){
            if(item.companyId == companyId){
                $scope.company = item;
                $scope.posList.push(item);
            };
        })
    });

    $scope.showPositionList = function(type) {
        $scope.activeType = type;
    }
}]);

angular.module('app').filter('positionTypeFilter', function(){
    return function(array, type){
        var result = [];
        if(!type){
            return array;
        } else {
            angular.forEach(array, function(item,index){
                if(item.jobType == type){
                    result.push(item);
                }
            });
            return result;
        }
        
    }
})