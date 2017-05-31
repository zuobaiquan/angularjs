angular.module('myApp',[])
//定义第二个指令：customTags2
.directive('customTags2',function(){
    return {
        restrict:'ECAM',
        template:'<div>222</div>',
        replace:true,
        priority:-1  //指示指令的优先级，优先级大的先执行，默认指令们的优先级都是0，但ng-repeat指令的优先级是1000
    }
})
//定义第三个指令：customTags3
.directive('customTags3',function(){
    return {
        restrict:'ECAM',
        template:'<div>333</div>',
        replace:true,
        priority:0,
        //小于0的directive都不会执行
        terminal:true  //为true时，指示优先级小于本指令的优先级的directive都不再执行
        //为false的时候，执行会报错，不能有多个template
    }
})
.controller('firstController',['$scope',function($scope){

}]);