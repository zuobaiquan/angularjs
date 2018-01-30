(function() {
    'use strict';
    angular.module('BlurAdmin.pages.contest', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('contest', {
            	url:'/contest',
                template: '<ui-view></ui-view>',
                abstract: true,
                title:'果仁大赛'
            })
            .state('contest.table',{
                url:'/table',
                templateUrl:'app/pages/contest/table/tablelist.html',
                controller:'tableCtrl',
                title:'报名表'
            })
            ;
    }
})();
