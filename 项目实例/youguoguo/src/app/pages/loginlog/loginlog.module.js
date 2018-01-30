(function() {
    'use strict';
    angular.module('BlurAdmin.pages.loginlog', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('loginlog', {
            	url:'/loginlog',
                template: '<ui-view></ui-view>',
                abstract: true,
                title:'登录日志'
            })
            .state('loginlog.loglist',{
                url:'/loglist',
                templateUrl:'app/pages/loginlog/loglist/loginloglist.html',
                controller:'logCtrl',
                title:'日志管理'
            })
            ;
    }
})();
