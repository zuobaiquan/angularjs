(function () {
  'use strict';

  angular
    .module('starter.pick', [])
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('pick', {
        url: '/pick/:code',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/order/pick/pick.html',
            controllerAs: 'vm',
            controller: ['$stateParams', function($stateParams) {
              var vm = this;
              vm.code = $stateParams.code;
            }]
          }
        },
        data: {
          requireLogin: false
        }
      });
  }

}());
