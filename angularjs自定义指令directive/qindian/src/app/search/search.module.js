(function () {
  'use strict';

  angular
    .module('starter.search', [])
    .config(RouterConfig)

  /** @ngInject */
  function RouterConfig($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/search',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/search/search.html',
            controller: 'SearchCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('searchResult', {
        url: '/searchResult',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/search-result/search-result.html',
            controller: 'SearchCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      })
  }

}());
