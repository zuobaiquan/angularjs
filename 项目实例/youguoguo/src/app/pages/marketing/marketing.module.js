(function() {
    'use strict';
    angular.module('BlurAdmin.pages.marketing', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('marketing', {
            	url:'/marketing',
                template: '<ui-view></ui-view>',
                abstract: true,
                title:'系统管理'
            })
            .state('marketing.notice',{
            	url:'/notice',
            	templateUrl:'app/pages/marketing/notice/noticelist.html',
            	controller:'noticeCtrl',
            	title:'系统推送'
            })
            .state('marketing.shortmes',{
                url:'/shortmes',
                templateUrl:'app/pages/marketing/shortmes/shortmeslist.html',
                controller:'shortmesCtrl',
                title:'短信推送'
            })
            .state('marketing.taste',{
                url:'/taste',
                templateUrl:'app/pages/marketing/taste/tastelist.html',
                controller:'marktasteCtrl',
                title:'最新体验'
            })
            .state('marketing.story',{
                url:'/story',
                templateUrl:'app/pages/marketing/story/storylist.html',
                controller:'storyCtrl',
                title:'故事'
            })
            .state('marketing.voucher',{
                url:'/voucher',
                templateUrl:'app/pages/marketing/voucher/voucherlist.html',
                controller:'voucherCtrl',
                title:'代金券'
            })
            .state('marketing.lottery',{
                url:'/lottery',
                templateUrl:'app/pages/marketing/lottery/lotteryconfiglist.html',
                controller:'lotteryconfigCtrl',
                title:'大转盘配置'
            })
            .state('marketing.notice-add',{
                url:'/notice-add',
                templateUrl:'app/pages/marketing/notice/add.html',
                controller:'editnoticeCtrl',
                controllerAs:'vm',
                title:'新增系统推送'
            })
            .state('marketing.shortmes-add',{
                url:'/shortmes-add',
                templateUrl:'app/pages/marketing/shortmes/add.html',
                controller:'editshortmesCtrl',
                controllerAs:'vm',
                title:'新增短信推送'
            })
            ;
    }
})();
