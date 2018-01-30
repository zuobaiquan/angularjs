/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.form', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('form', {
          url: '/form',
          template : '<ui-view></ui-view>',
          abstract: true,
          title: ipzoe_sidebar[4].name,
          sidebarMeta: {
            icon: 'ion-compose',
            order: ipzoe_sidebar[4].order,
          },
        })
        .state('form.inputs', {
          url: '/inputs',
          templateUrl: 'app/pages/form/inputs/inputs.html',
          title: ipzoe_sidebar[4].submenu[0].name,
          sidebarMeta: {
            order: ipzoe_sidebar[4].submenu[0].order,
          },
        })
        ;
  }
})();
