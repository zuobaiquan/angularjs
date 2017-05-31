var app=angular.module("myApp",[]);
app.controller("myCtrl",function($scope){
    $scope.cartList=[
        {id:1000,name:"iphone5s",quantity:3,price:4300},
        {id:1001,name:"iphone5",quantity:30,price:3300},
        {id:1002,name:"imac",quantity:3,price:3000},
        {id:1003,name:"ipad",quantity:5,price:6900}
    ];

    var findIndex=function(id){
        var index=-1;
        angular.forEach($scope.cartList,function(item,key){
            if(item.id == id){
                index=key;
                return;
            }
        });return index;
    };

    //从cartList数组中删除一项产品  
    $scope.remove=function(id){
        var index=findIndex(id);
        if(index != -1){
            $scope.cartList.splice(index,1);
        }
    };

    //为某个商品添加一个数量  
    $scope.addOne=function(id){
        var index=findIndex(id);
        if(index != -1){
            $scope.cartList[index].quantity ++;
        }
    };
    //位某个商品减少一个数量  
    $scope.reduceOne=function(id){
        var index=findIndex(id);
        if(index != -1){
            var item=$scope.cartList[index];
            if(item.quantity > 1){
                item.quantity --;
            }else{
                var returnKey=confirm("删除该商品？");
                if(returnKey){
                    $scope.remove(item.id);
                }
            }
        }
    };

    //总购买价  
    $scope.totalCost=function(){
        var total=0;
        angular.forEach($scope.cartList,function(item,key){
            total += item.quantity * item.price;
        });return total;
    };
    //总购买数量  
    $scope.totalCount=function(){
        var count=0;
        angular.forEach($scope.cartList,function(item,key){
            count += item.quantity;
        });return count;
    };

    //监听输入框更改事件避免输入负数或字符串  
    $scope.$watch('cartList',function(newValue,oldValue){
        console.log( "$scope.cartList === newValue "+ ($scope.cartList === newValue) ); //永远为ture newValue指向cartList  
        console.log( "$scope.cartList === oldValue "+ ($scope.cartList === oldValue) ); //页面初始化后为true 一旦改动永远为false  
        angular.forEach(newValue,function(item,key){
            if( isNaN(item.quantity) ){
                item.quantity=oldValue[key].quantity;
            }
            else if( item.quantity <= 0 ){
                var returnKey=confirm("删除该商品？");
                if(returnKey){
                    $scope.remove(item.id);
                }else{
                    item.quantity=oldValue[key].quantity;
                }
            }
        });
    },true);

});  