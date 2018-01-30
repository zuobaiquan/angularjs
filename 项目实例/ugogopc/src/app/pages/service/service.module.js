(function() {
    'use strict';
    angular.module('BlurAdmin.pages.service', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('service', {
            	url:'/service',
                template: '<ui-view></ui-view>',
                abstract: true,
                title:'业务管理'
            })
            .state('service.order',{
                url:'/order/:id',
                templateUrl:'app/pages/service/order/orderlist.html',
                controller:'orderCtrl',
                title:'订单管理'
            })
            .state('service.taste',{
                url:'/taste/:id',
                templateUrl:'app/pages/service/taste/tastelist.html',
                controller:'tasteCtrl',
                title:'体验管理'
            })
            .state('service.taste-add',{
                url:'/taste-add',
                templateUrl:'app/pages/service/taste/edit.html',
                controller:'editCtrl',
                controllerAs:'vm',
                title:'发布体验',
                data:{
                  operate:'add'
                }
            })
            .state('service.taste-edit',{
                url:'/taste-edit/:id',
                templateUrl:'app/pages/service/taste/edit.html',
                controller:'editCtrl',
                controllerAs:'vm',
                title:'编辑体验',
                data:{
                  operate:'edit'
                }
            })

            ;
    }
})();
