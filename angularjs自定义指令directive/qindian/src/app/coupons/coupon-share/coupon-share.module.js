(function () {
  'use strict';

  angular
    .module('stater.couponShare', [])
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('couponShare', {
        url: '/coupon-share/:orderId',

        cache: false,
        views: {
          'content': {
            templateUrl: 'app/coupons/coupon-share/coupon-share.html',
            controller: 'couponShareCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('couponEdit', {
        url: '/coupon-edit',

        cache: false,
        views: {
          'content': {
            templateUrl: 'app/coupons/coupon-edit/coupon-edit-tel.html'
          }
        },
        data: {
          requireLogin: true
        }
      });
  }

}());
