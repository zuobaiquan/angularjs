(function() {
    'use strict';
    angular.module('BlurAdmin.pages.market', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('market', {
            	url:'/market',
                template: '<ui-view></ui-view>',
                abstract: true,
                title:'市场管理'
            })
            .state('market.store',{
                url:'/store/:id',
                templateUrl:'app/pages/market/store/storelist.html',
                controller:'storeCtrl',
                title:'店家管理'
            })
            .state('market.superman',{
                url:'/superman/:id',
                templateUrl:'app/pages/market/superman/supermanlist.html',
                controller:'supermanCtrl',
                title:'达人管理'
            })
            ;
    }
})();
