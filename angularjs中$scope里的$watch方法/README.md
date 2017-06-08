```bash
$scope 对象上的 $watch 方法会给Angular事件循环内的每个 $digest 调用装配一个脏值检查。
如果在表达式上检测到变化，Angular总是会返回 $digest 循环。

1、在digest执行时，如果watch观察的value与上次执行时不一样，就会被触发

2、angualrjs内部的watch实现了页面随model的及时更新

3、$watch(watchFn,watchAction,deepWatch)
   >> watchFn:angualr表达式或函数的字符串
   >> watchAction(newValue,oldValue,scope):watchFn发生变化会被调用
   >> deepWatch:可选的布尔值命令检查被监控的对象的每个属性是否发生变化
   
4、$watch会返回一个函数，想要注销这个watch可以使用函数   

```

```javascript
//监听data对象，只要data里面每一个属性变化了，都会触发watch
//如果deepWatch参数不写true，则只会检查data对象
//第三个参数 深度检查 deepWatch
$scope.data={
  	username:"李四",
  	age:20
}
$scope.$watch('data',function(newval,oldval){
	console.log(newval,oldval);
},true);
```

```javascript
//<input type="text" value="" ng-model="height"/>

$scope.height=160;
var person=$scope.$watch('height',function(newValue,oldValue){
    console.log(newValue,oldValue);
    if(newValue > 180){
        console.log("你已经长大了，不需要watch了哦");
        //注销这个watch
        person();
  	}
});
```



```javascript
$scope.name = '张三';
$scope.count=0;
// 监听一个model 当一个model每次改变时 都会触发第2个函数
//$watch(watchFn,watchAction,deepWatch)
$scope.$watch('name',function(newValue,oldValue){
    console.log(newValue,oldValue);
    ++$scope.count;
    if($scope.count > 30){
        $scope.name = '已经大于30次了';
    }
});
```





