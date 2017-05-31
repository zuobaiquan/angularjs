angular.module('myApp',[])
.directive('bookList',function(){
    return {
        restrict:'E',
        template:'<div><ul><li ng-repeat="book in books">{{ book.name }}</li></ul><book-add></book-add></div>',
        replace:true,
        controller:function($scope){
            $scope.books=[
                {name:'book01'},
                {name:'book02'},
                {name:'book03'}
            ];
            this.addBook=function(name){
                if(typeof(name)=='undefined' || name.length<1){alert('书名不可为空！');return;}
                $scope.$apply(function(){
                    var exist=false;
                    angular.forEach($scope.books,function(ele,i){
                        if(ele.name == name){
                            exist=true;
                            return;
                        }
                    });
                    if(exist){
                        alert('该书已经存在！')
                    }
                    else{
                        $scope.books.push({name:name});
                    }
                });
            }
        },
        controllerAs:'bookListController'
    }
})
.directive('bookAdd',function(){
    return {
        restrict:'E',
        template:'<div><input type="text" placeholder="书名" ng-model="newBookName"><button type="button">添加</button></div>',
        replace:true,
        require:'^bookList',
        link:function(scope,iElement,iAttrs,bookListController){
            iElement.find('button').on('click',function(){
                bookListController.addBook(scope.newBookName);
            })
        }
    }
})
.controller('myCtrl',function($scope){});