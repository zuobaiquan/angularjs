(function () {
  'use strict';

  angular
    .module('starter.account', [])
    .config(RouterConfig)

  /** @ngInject */
  function RouterConfig($stateProvider) {
    $stateProvider
      .state('account', {
        url: '/account',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/account/account.html',
            controller: 'AccountCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('info', {
        url: '/info',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/account/account-info/account-info.html',
            controller: 'AccountCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('editname', {
        url: '/editname',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/account/edit-username/edit-username.html',
            controller: 'EditUsernameCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('edittel', {
        url: '/edittel',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/account/edit-tel/edit-tel.html',
            controller: 'EditTelCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('balance', {
        url: '/balance',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/account/balance/balance.html',
            controller: 'AccountCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('balanceRecord', {
        url: '/record',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/account/balance-record/balance-record.html',
            controller: 'BananceRecordCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('coupon', {
        url: '/coupon/:type/:status',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/account/coupon/coupon.html',
            controller: 'myCouponCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('couponInvalid', {
        url: '/couponInvalid/:status',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/account/coupon-invalid/coupon-invalid.html',
            controller: 'myCouponCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('recharge', {
        url: '/recharge',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/account/balance/recharge/recharge.html',
            controller: 'rechargeCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('customer', {
        url: '/customer',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/account/customer/customer.html'
          }
        },
        data: {
          requireLogin: true
        }
      })
  }

}());
