(function () {
  'use strict';

  angular.module('BlurAdmin.pages.index', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('index', {
          url: '/index',
          templateUrl: 'app/pages/index/page-index.html',
          title: '欢迎页',
          sidebarMeta: {
            icon: 'ion-android-home',
            order:0
          },
        });
  }

})();
