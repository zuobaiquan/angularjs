

var myApp = angular.module('myApp',[],function($provide){
    //模块启动时，在模块中配置信息，供controller使用
    console.log(1111111);


    // 自定义服务
    $provide.provider('CustomService',function(){

        this.$get = function(){
            return {
                message : 'CustomService Message'
            }
        }
    });

    $provide.provider('CustomService2',function(){

        this.$get = function(){
            return {
                message : 'CustomService2 Message'
            }
        }
    });
});

myApp.controller('firstController',function(CustomService,$scope,CustomService2){
    console.log(2222222);
    $scope.name = '张三';
    console.log(CustomService2);
});


