(function () {
  'use strict';

  angular
    .module('starter.order', [])
    .config(RouterConfig)

  /** @ngInject */
  function RouterConfig($stateProvider) {
    $stateProvider
      .state('ensureOrder', {
        url: '/ensureOrder/:orderType',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/order/ensure-order/ensure-order.html',
            controller: 'EnsureOrderCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('payOrder', {
        url: '/payOrder/:isGroup/:data',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/order/order-pay/order-pay.html',
            controller: 'PayCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('myOrder', {
        url: '/myOrder',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/order/order-myself/order-myself.html',
            controller: 'MyOrderCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('orderDetai', {
        url: '/orderdetail/:order',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/order/order-detail/order-detail.html',
            controller: 'OrderDetailCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      })
  }

}());
