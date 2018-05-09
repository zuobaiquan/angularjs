(function () {
  'use strict';
  angular
    .module('starter.location')
    .controller('SearchLocationCtrl', SearchLocationCtrl);

  /** @ngInject */
  function SearchLocationCtrl($scope, applyApi, $state, $stateParams, locationService, $ionicHistory, $http, GDAPI_TOKEN) {
    var vm = this
    var token = GDAPI_TOKEN;
    vm.searchData = {
      key: $stateParams.key
    };
    vm.resultLocation = getSearchResult()
    vm.searchLocation = searchLocation
    vm.setCurrentBoard = setCurrentBoard
    vm.showBoardOfLocation = getNearbyBoard;
    var GDKEY = "dee7b2a84e2f2dbbd035e1bbcc847778";

    function getSearchResult() {
      vm.isBoards = false;
      $http({
        method: 'GET',
        url: 'http://restapi.amap.com/v3/assistant/inputtips?key='+token+'&keywords=' + vm.searchData.key + '&city=苏州&output=JSON'
      }).then(function successCallback(response) {
        vm.isAdvice = true;
        vm.adviceLocation = response.data.tips.splice(1, response.data.tips.length -1 );
        console.log('地址建议列表', vm.adviceLocation);
      });

    }

    function searchLocation(e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode !== 13 || vm.searchData.key === '') {
        return;
      }
      getSearchResult();
    }

    function setCurrentBoard(board) {
      locationService.setTarget(board);
      $ionicHistory.goBack(-2);
    }

    function getNearbyBoard(item) {
      vm.isAdvice = false;
      vm.isBoards = true;
      var params = {};
      var location = item.location.split(',');
      params.latitude = location[0];
      params.longitude = location[1];
      params.key = item.name;
      vm.searchData.key = item.name;
      console.log('经纬度', params);
      applyApi.post('cupboard/search', params,
        function (rel) {
          if (rel.data.length !== 0) {
            vm.resultLocation = rel.data;
          } else {
            applyApi.post('cupboard/list', params,
              function (response) {
                vm.resultLocation = response.data;
                console.log('搜索结果为空时返回的柜子信息', vm.resultLocation);
              },
              function (reason) {
                vm.resultLocation = [];
                console.log('搜索时-获取柜子列表失败');
              });
          }

        },
        function () {
          console.log('搜索地址错误');
        }
      );
    }
  }
})();
