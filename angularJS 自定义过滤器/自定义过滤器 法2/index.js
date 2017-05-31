
var app=angular.module('myApp',[])
//自定义过滤器  方式二  不显示上海的人员
app.filter('filterCity',function(){
    return function (obj){
        var newObj=[];
        angular.forEach(obj,function(item){
            if(item.city != "上海"){
                newObj.push(item);
            }
        });
        return newObj;
    }
});
app.controller("myCtrl",function($scope){
    $scope.list=[
        { name:'张三', age:20, city:'上海' },
        { name:'李思', age:30, city:'北京' },
        { name:'王五', age:25, city:'深圳' }
    ]
});