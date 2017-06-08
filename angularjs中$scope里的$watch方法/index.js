angular.module("myApp",[])  
.controller("firstController", function ($scope) {
    $scope.name = '张三';
    $scope.count=0;
    // 监听一个model 当一个model每次改变时 都会触发第2个函数
    //$watch(watchFn,watchAction,deepWatch)
    $scope.$watch('name',function(newValue,oldValue){
        console.log(newValue,oldValue);
        ++$scope.count;
        if($scope.count > 30){
            $scope.name = '已经大于30次了';
        }
    });

    //第三个参数 深度检查 deepWatch
    $scope.data={
        username:"李四",
        age:20
    }

    //监听data对象，只要data里面每一个属性变化了，都会触发watch
    //如果deepWatch参数不写true，则只会检查data对象
    $scope.$watch('data',function(newval,oldval){
        console.log(newval,oldval);
    },true);

    $scope.height=160;
    var person=$scope.$watch('height',function(newValue,oldValue){
        console.log(newValue,oldValue);
        if(newValue > 180){
            console.log("你已经长大了，不需要watch了哦");
            //注销这个watch
            person();
        }
    });


});  