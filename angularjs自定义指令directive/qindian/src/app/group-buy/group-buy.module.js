(function () {
  'use strict';

  angular
    .module('starter.groupBuy', [
      'starter.groupShare'
    ])
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('groupBut', {
        url: '/group-buy',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/group-buy/group-buy.html',
            controller: 'groupCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('groupShare', {
        url: '/group-share/:userId/:payNo/:groupId',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/group-buy/share/group-share.html',
            controller: 'groupShareCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('groupRule', {
        url: '/group-rule',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/group-buy/rule/group-rule.html'
          }
        },
        data: {
          requireLogin: true
        }
      });
  }

}());
