angular.module('myApp',[])
//定义第一个指令 bookList
.directive('bookList',function(){
    return {
        restrict:'ECAM',
        controller:function($scope){
            $scope.books=[
                {name:'php'},{name:'javascript'},{name:'java'}
            ];
            this.addBook=function(){
                $scope.$apply(function(){
                    $scope.books.push({name:'Angularjs'});
                });
            }
        },
        controllerAs:'bookListController',
        //这个template中使用了第二个指令bookAdd
        template:'<div><ul><li ng-repeat="book in books">{{ book.name }}</li></ul> <book-add></book-add> </div>',
        replace:true
    }
})
//定义第二个指令 bookAdd
.directive('bookAdd',function(){
    return{
        restrict:'ECAM',
        require:'^bookList',
        template:'<button type="button">添加</button>',
        replace:true,
        link:function(scope,iElement,iAttrs,bookListController){  //这里引用了bookList指令
            iElement.on('click',bookListController.addBook);
        }
    }
})
.controller('firstController',['$scope',function($scope){
}])