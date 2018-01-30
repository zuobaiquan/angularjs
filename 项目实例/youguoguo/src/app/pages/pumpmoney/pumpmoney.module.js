(function() {
    'use strict';
    angular.module('BlurAdmin.pages.pumpmoney', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('pumpmoney', {
            	url:'/pumpmoney',
                template: '<ui-view></ui-view>',
                abstract: true,
                title:'财务管理'
            })
            .state('pumpmoney.pump',{
                url:'/pump',
                templateUrl:'app/pages/pumpmoney/pump/pumplist.html',
                controller:'pumpCtrl',
                title:'抽成管理'
            })
            ;
    }
})();
