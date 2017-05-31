angular.module('myApp',[],function($filterProvider, $provide, $controllerProvider){

    //自定义过滤器  方式三  仅显示年龄大于等于25岁的人员
    $filterProvider.register('myfilterAge',function(){
        return function (obj){
            var newObj=[];
            angular.forEach(obj,function(item){
                if(item.age >= 25){
                    newObj.push(item);
                }
            });
            return newObj;
        }
    });

    //定义服务
    $provide.service('List',function(){
        return [
            { name:'张三', age:20, city:'上海' },
            { name:'李思', age:30, city:'北京' },
            { name:'王五', age:25, city:'深圳' }
        ]
    });

    //定义控制器
    $controllerProvider.register('myCtrl',function($scope,List){
        $scope.list=List;
    });

});