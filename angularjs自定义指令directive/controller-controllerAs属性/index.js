angular.module('myApp',[])
.directive('bookList',function(){
    return {
        restrict:'ECAM',
        //此处定义了该指令的controller属性
        controller:function($scope){
            $scope.books=[
                {name:'php'},
                {name:'javascript'},
                {name:'java'}
            ];
            this.addBook=function(){       //或者 $scope.addBook=...
                alert('test');
            }
        },
        controllerAs:'bookListController', //给当前controller起个名称
        template:'<ul><li ng-repeat="book in books">{{ book.name }}</li></ul>',
        replace:true,
        //link中注入 bookListController ，就可以使用它的方法了，bookListController是控制器的名字
        link:function(scope,iElement,iAttrs,bookListController){
            iElement.on('click',bookListController.addBook);
        }
    }
})
.controller('firstController',['$scope',function($scope){

}])