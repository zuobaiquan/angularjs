/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',
    'util.ui.pagination',
    'util.ui.modal',
    'BlurAdmin.pages.index',
    'BlurAdmin.pages.account',
    'BlurAdmin.pages.service',
     //'BlurAdmin.pages.ui',
     'BlurAdmin.pages.form'
  ])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider) {
    // $urlRouterProvider.otherwise('/home');
  }

})();
