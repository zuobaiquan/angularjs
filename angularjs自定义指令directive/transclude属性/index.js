var app = angular.module('myApp',[])
//自定义指令的属性 transclude：为true时，
// 允许把html中新定义的指令中原来的dom运用到该指令的template中。
.directive('customTags',function(){
    return {
        restrict:'ECAM',
        //<span ng-transclude></span> 原来的dom
        template:'<div>我是新数据<br/><span ng-transclude></span></div>',
        transclude:true, //为true时，允许把节点内原来的dom放入template中
        replace:true     //为true时，设置的template或templateUrl都必须仅由一个最外层标签包裹
    }
})
app.controller('firstController', function ($scope) {

});