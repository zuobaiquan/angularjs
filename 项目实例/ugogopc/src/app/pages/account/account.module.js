(function() {
    'use strict';
    angular.module('BlurAdmin.pages.account', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('account', {
            	url:'/account',
                template: '<ui-view></ui-view>',
                abstract: true,
                title:'账户管理'
            })
            .state('account.introinfo',{
                url:'/introinfo/:id',
                templateUrl:'app/pages/account/introinfo/infolist.html',
                controller:'introinfoCtrl',
                title:'介绍资料'
            })
            .state('account.introinfo-editshopex',{
                params:{item:null},
                url:'/introinfo-editshopex',
                templateUrl:'app/pages/account/introinfo/editinfoshopex.html',
                controller:'editinfoshopexCtrl',
                title:'编辑介绍资料'
            })
            .state('account.introinfo-edit',{
                params:{item:null},
                url:'/introinfo-edit',
                templateUrl:'app/pages/account/introinfo/editteacher.html',
                controller:'editinfoCtrl',
                title:'编辑介绍资料'
            })
            .state('account.introinfo-add',{
                params:{item:null},
                url:'/introinfo-add',
                templateUrl:'app/pages/account/introinfo/editinfo.html',
                controller:'editinfoCtrl',
                title:'编辑介绍资料'
            })

            ;
    }
})();
