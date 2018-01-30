(function() {
    'use strict';
    angular.module('BlurAdmin.pages.baseconfig', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('baseconfig', {
            	url:'/baseconfig',
                template: '<ui-view></ui-view>',
                abstract: true,
                title:'系统管理'
            })
            .state('baseconfig.type',{
            	url:'/type',
            	templateUrl:'app/pages/baseconfig/type/typelist.html',
            	controller:'typeCtrl',
            	title:'类别管理'
            })
            .state('baseconfig.intertags',{
                url:'/intertags',
                templateUrl:'app/pages/baseconfig/intertags/taglist.html',
                controller:'intertagsCtrl',
                title:'兴趣标签'
            })
            .state('baseconfig.area',{
                url:'/area',
                templateUrl:'app/pages/baseconfig/area/arealist.html',
                controller:'areaCtrl',
                title:'区域城市'
            })
            .state('baseconfig.abroad',{
                url:'/abroad',
                templateUrl:'app/pages/baseconfig/abroad/abroadlist.html',
                controller:'abroadCtrl',
                title:'国外国家'
            })
            ;
    }
})();
