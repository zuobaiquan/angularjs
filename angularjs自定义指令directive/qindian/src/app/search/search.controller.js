(function () {
  'use strict';
  angular
    .module('starter.search')
    .controller('SearchCtrl', SearchCtrl);

  /** @ngInject */
  function SearchCtrl($scope, applyApi, $state, $window, locationService, QINIU_LINK, homeService) {
    $scope.searchData = {
      isSearch: false,
      key: '',
      cupboardId: -99
    };
    $scope.searchResult = {
      hasResult: false,
      data: []
    };
    $scope.searchHistory = getSearchHistories();
    $scope.clearHistories = clearHistories;
    $scope.keySearch = searchFoods;
    $scope.changeArticleCount = changeArticleCount;
    $scope.QINIU_LINK = QINIU_LINK;
    $scope.count = {};

    $scope.search = function (e) {
      var keycode = window.event ? e.keyCode : e.which;

      if ($scope.searchData.key === '') {
        $scope.searchResult.hasResult = false
        $scope.searchData.isSearch = false
      }

      if (keycode === 13 && $scope.searchData.key !== '') {
        addSearchHistory();
        searchFoods();
      }
    }

    function searchFoods(key) {
      var cupboard = locationService.getTarget()

      $scope.searchData.key = $scope.searchData.key || key
      $scope.searchData.cupboardId = cupboard.id

      applyApi.post('food/search', $scope.searchData,
        function (rel) {
          $scope.searchResult.hasResult = rel.data.length !== 0 ? true : false
          $scope.searchResult.data = rel.data
          $scope.searchData.isSearch = true
        },
        function () {
          $scope.searchResult.hasResult = false
          $scope.searchData.isSearch = true
          console.log('search error')
        }
      )
    }

    function getSearchHistories() {
      var _searchHistory = $window.localStorage.getItem('qd-search-history') || [];
      if (typeof _searchHistory === 'string') {
        _searchHistory = _searchHistory.split(',');
      }
      return _searchHistory;
    }

    function addSearchHistory() {
      for (var history in $scope.searchHistory) {
        if ($scope.searchHistory[history] === $scope.searchData.key) {
          return
        }
      }
      $scope.searchHistory.push($scope.searchData.key)
      $window.localStorage.setItem('qd-search-history', $scope.searchHistory)
    }

    function clearHistories() {
      $scope.searchHistory = []
      $window.localStorage.removeItem('qd-search-history')
    }

    function changeArticleCount(type, food) {
      
      homeService.addToShopcart(type, food);
      var foodId = food.id || food.foodId;
      if (type === 'add') {
        // 单一商品数量增加
        $scope.count[foodId] = $scope.count[foodId] + 1 || 1;
      } else {
        $scope.count[foodId] = $scope.count[foodId] - 1;
      }
    }

  }
})();
