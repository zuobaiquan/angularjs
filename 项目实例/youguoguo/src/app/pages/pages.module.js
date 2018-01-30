
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',
    'util.ui.pagination',
    'util.ui.modal',
    'BlurAdmin.pages.index',
    'BlurAdmin.pages.business',
    'BlurAdmin.pages.market',
    'BlurAdmin.pages.marketing',
    'BlurAdmin.pages.baseconfig',
    'BlurAdmin.pages.system',
    'BlurAdmin.pages.loginlog',
    'BlurAdmin.pages.pumpmoney',
    'BlurAdmin.pages.datacenter',
    'BlurAdmin.pages.contest',
    'BlurAdmin.pages.form'
  ])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider) {
    // $urlRouterProvider.otherwise('/home');
  }

})();
