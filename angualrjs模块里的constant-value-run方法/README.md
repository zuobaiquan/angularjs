```html
constant(name,object)
此方法首先运行，可以用它来声明整个应用范围内的常量，并且让它们在所有配置(config方法里)和实例(controller，service等)方法中都可用
```

```
run(initializationFn)
想要在注入启动之后执行某些操作，而这些操作需要在页面对用户可用之前执行，可以使用此方法
比如加载远程的模板，需要在使用前放入缓存，或者在使用操作前判断用户是否登录，未登录可以先去登录页面
```

```javascript
angular.module('myApp',[],['$provide',function($provide){
    console.log('$provide-config');
    // $provide.factory
    // $provide.service
    //  constant也属于$provide里边，但一般用快捷方法
    // $provide.constant
    // $provide.value;
}])

//不能注入value值，可以注入constant的值
.config(function(APIKEY){
    console.log(APIKEY);
    console.log('config');
})

// 在config之后controller等其他服务之前。。
.run(function(){
    console.log('run');
})
    
// constant它可以注入任何方法
.constant('APIKEY','xxxx')

// value只能注入controller...service factory
.value('vension','1.0.0')

.controller('firstController',['APIKEY','vension',function(APIKEY,vension){
    console.log(APIKEY);
    console.log(vension);
    console.log('controller');
}]);
```

```html
<body ng-app="myApp" >
	<div ng-controller="firstController">
	</div>
</body>
```