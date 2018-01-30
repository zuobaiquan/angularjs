(function() {
    'use strict';
    angular.module('BlurAdmin.pages.system', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('system', {
            	url:'/system',
                template: '<ui-view></ui-view>',
                abstract: true,
                title:'系统管理'
            })
            .state('system.role',{
            	url:'/role',
            	templateUrl:'app/pages/system/role/rolelist.html',
            	controller:'roleCtrl',
            	title:'角色维护'
            })
            .state('system.user',{
                url:'/user',
                templateUrl:'app/pages/system/user/userlist.html',
                controller:'userCtrl',
                title:'用户维护'
            })
            .state('system.section',{
                url:'/section',
                templateUrl:'app/pages/system/section/section.html',
                controller:'sectionCtrl',
                title:'部门维护'
            })
            ;
    }
})();
