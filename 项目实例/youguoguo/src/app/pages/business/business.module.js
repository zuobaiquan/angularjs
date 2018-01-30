(function() {
    'use strict';
    angular.module('BlurAdmin.pages.business', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('business', {
            	url:'/business',
                template: '<ui-view></ui-view>',
                abstract: true,
                title:'业务管理'
            })
            .state('business.taste',{
                url:'/taste/:id',
                templateUrl:'app/pages/business/taste/tastelist.html',
                controller:'tasteCtrl',
                title:'体验管理'
            })
            .state('business.order',{
                url:'/order/:id',
                templateUrl:'app/pages/business/order/orderlist.html',
                controller:'orderCtrl',
                title:'订单管理'
            })
            .state('business.member',{
                url:'/member/:id',
                templateUrl:'app/pages/business/member/memberlist.html',
                controller:'memberCtrl',
                title:'会员管理'
            })
            .state('business.comment',{
                url:'/comment/:id',
                templateUrl:'app/pages/business/comment/commentlist.html',
                controller:'commentCtrl',
                title:'评价管理'
            })
            .state('business.feedback',{
                url:'/feedback/:id',
                templateUrl:'app/pages/business/feedback/feedbacklist.html',
                controller:'feedbackCtrl',
                title:'用户反馈'
            })
            .state('business.cancelorder',{
                url:'/cancelorder',
                templateUrl:'app/pages/business/cancelorder/cancelorderlist.html',
                controller:'cancelorderCtrl',
                title:'退款管理'
            })
            .state('business.taste-edit',{
                url:'/taste-edit/:id',
                templateUrl:'app/pages/business/taste/editpage/edit.html',
                controller:'editpagetasteCtrl',
                controllerAs:'vm',
                title:'编辑体验'
            })
            ;
    }
})();
