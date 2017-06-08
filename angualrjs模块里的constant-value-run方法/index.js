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