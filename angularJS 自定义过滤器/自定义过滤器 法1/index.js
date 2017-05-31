var app=angular.module('myApp',[])
.factory('List',function(){
    return [
        { name:'张三', age:20, city:'上海' },
        { name:'李思', age:30, city:'北京' },
        { name:'王五', age:25, city:'深圳' }
    ]
})
.controller("myCtrl",function($scope,List){
    $scope.list=List;
    //自定义过滤器方式一 （在controller方法内定义一个方法）
    //自定义过滤器 方式一  仅显示年龄小于30岁的人员
    $scope.myFilter1=function(obj){
        if(obj.age <=25){
            return true;
        }return false;
    };
});  