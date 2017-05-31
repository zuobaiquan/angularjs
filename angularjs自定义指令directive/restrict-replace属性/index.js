var app = angular.module('myApp',[],['$compileProvider',function($compileProvider){
    console.log($compileProvider);//这里面包含directive方法
    //第一个参数是指令名称
    //第二个参数是个function，返回设置指令属性的对象
    //-->指令的名字
    //指令的名字不要使用ng为指令名称，这样可能会和angular内置指令冲突
    //如果指令的名字为 xxx-yyy 在设置指令的名字时应为xxxYyy驼峰式命名
    // template：模板的内容，这个内容会根据replace参数的设置替换节点或只替换节点内容
    // replace :如果此配置为true，则替换指令所在的元素，如果为false或者不指定，则把当前指令追加到所在元素的内部
    //    对于restrict为元素(E)在最终效果是多余的，所有的replace通常设置为true
    $compileProvider.directive('customTags',function(){
        return {
            restrict:'ECAM',
            template:'<ul><li ng-repeat="user in users">{{ user.id }} {{ user.name}}</li></ul>',
            replace:true,
            //这里可以通过comppile,如果console.log四次，表示都渲染成功
            compile:function(){
                console.log(1);
            }
        }
    })
}]);
app.controller('firstController', function ($scope) {
    //假如这个用户list有多个页面要用到，
    // 或者说我们不想直接把它写在html里，
    // 这时就可以使用angularJS的'自定义指令'了
    $scope.users=[
        {id:12,name:'张三'},
        {id:15,name:'李四'},
        {id:18,name:'王五'}
    ]
});