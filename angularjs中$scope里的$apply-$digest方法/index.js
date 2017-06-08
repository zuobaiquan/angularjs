//用 $scope的$apply方法实现每秒自动刷新model
angular.module('myApp',[])
    .controller('firstController',function($scope){
        console.log($scope);
        $scope.date=new Date();
//    setInterval(function(){
//        //这里虽然变 但是并没有触发 脏检查
//        $scope.date = new Date();
//    },1000)
        $scope.count=0;
        setInterval(function(){
            $scope.$apply(function(){
                $scope.date=new Date();
                //....会去触发脏检查
                $scope.count++;
            });
        },1000);
    });

//控制器内，$scope有个$apply方法，可以代码更改model并同步更新页面。
//通常，控制器内的方法执行完毕后仅会自动刷新一次页面展示，使用$apply方法即可在想刷新页面时就刷新。
//如本例，这个方法接收function类型的参数。
