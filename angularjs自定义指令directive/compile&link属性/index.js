var i=0;
angular.module('myApp',[])
//定义第一个指令：customTags
.directive('customTags',function(){
    return {
        restrict:'ECAM',
        template:'<div>{{ user.name }}</div>',
        replace:true,
        //定义了compile就不需定义link,当compile返回一个方法这个方法就是link
        //tElement 正在执行该指令的当前dom元素的jquery对象
        //tAttrs   正在执行该指令的当前dom元素的属性
        compile:function(tElement,tAttrs,transclude){
            //第一个指令的编译阶段...
            console.log('customTags compile 编译阶段...');

            //若要改变dom元素,应在compile中做，此处在当前dom元素中添加一个<span>
            tElement.append(angular.element('<span> {{user.count}}</span>'));
            return {
                //pre:编译阶段之后执行
                pre:function preLink(scope,iElement,iAttrs,controller){
                    console.log('customTags preLink..');
                },
                //post:所有子元素指令的post都执行后执行，此处设置了dom元素的点击事件
                post:function postLink(scope,iElement,iAttrs,controller){
                    iElement.on('click',function(){
                        scope.$apply(function(){
                            scope.user.name=' click after';
                            scope.user.count= ++i;
                        });
                    });
                    console.log('customTags post end.');
                }
            };
            //compile也可直接返回一个方法，这就是 postLink，也就是上面的post
            //return function (){
            //    console.log('compile return this function')
            //}
        },
        //进行scope绑定及事件绑定
        link:function(scope,iElement,iAttrs,bookListController){
            //link不会再执行了，因为这里定义的就是postLink
        }
    }
})

//定义第二个指令：customTags2
.directive('customTags2',function(){
    return {
        restrict:'ECAM',
        replace:true,
        compile:function(tElement,tAttrs,transclude){
            console.log('customTags2 compile 编译阶段...');
            return {
                pre:function preLink(){
                    console.log('customTags2 preLink..');
                },
                post:function postLink(){
                    console.log('customTags2 post end.');
                }
            };
        }
    }
})
.controller('firstController',['$scope',function($scope){
    //$scope.users=[
    //    {id:10,name:'张三',count:0}
    //]
    $scope.users=[
        {id:10,name:'张三',count:0},{id:20,name:'李四',count:0}
    ]
}]);