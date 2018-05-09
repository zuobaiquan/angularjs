(function () {
  'use strict';

  angular
    .module('starter.location', [])
    .config(RouterConfig)

  /** @ngInject */
  function RouterConfig($stateProvider) {
    $stateProvider
      .state('location', {
        url: '/location',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/location/location.html',
            controller: 'LocationCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }

      })
      .state('locationSearch', {
        url: '/locationSearch/:key',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/location/location-search/location-search.html',
            controller: 'SearchLocationCtrl',
            controllerAs: 'vm'
          },
          data: {
            requireLogin: true
          }
        }
      })
      .state('locationMore', {
        url: '/locationMore',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/location/location-more/location-more.html',
            controller: 'LocationCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('locationKdg', {
        url: '/locationKdg',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/location/location-kdg/location-kdg.html',
            controller: 'LocationCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
  }

}());
