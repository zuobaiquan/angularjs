angular.module('product',[])
.factory('productList',function(){
    return [
        { id:910,name:"imac",price:15400 },
        { id:80,name:"iphone",price:5400 },
        { id:29,name:"ipad",price:1420 },
        { id:500,name:"ipad air",price:2340 },
        { id:1200,name:"ipad mini",price:2200 }
    ]
})
.controller('productController',function($scope,productList){
    $scope.productList=productList;
    $scope.orderColumn='name'; //排序字段
    $scope.orderSign='-';      //为空时正序 为负号时倒序
    $scope.sortProduct=function(sortColumn){  //点击列标题排序事件
        $scope.orderColumn=sortColumn;
        if($scope.orderSign=="-"){
            $scope.orderSign="";
        }else{
            $scope.orderSign='-';
        }
    };
});