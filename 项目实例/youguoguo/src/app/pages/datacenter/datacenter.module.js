(function() {
    'use strict';
    angular.module('BlurAdmin.pages.datacenter', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('datacenter', {
            	url:'/datacenter',
                template: '<ui-view></ui-view>',
                abstract: true,
                title:'数据中心'
            })
            .state('datacenter.collect',{
                url:'/collect',
                templateUrl:'app/pages/datacenter/collect/collectlist.html',
                controller:'collectCtrl',
                title:'体验收藏统计'
            })
            .state('datacenter.lotterydata',{
                url:'/lotterydata',
                templateUrl:'app/pages/datacenter/lotterydata/lotterydatalist.html',
                controller:'lotterydataCtrl',
                title:'大转盘获奖名单'
            })
            ;
    }
})();
