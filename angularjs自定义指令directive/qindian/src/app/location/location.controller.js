(function () {
  'use strict';
  angular
    .module('starter.location')
    .controller('LocationCtrl', LocationCtrl);

  /** @ngInject */
  function LocationCtrl($state, $window, $ionicHistory, locationService) {
    var vm = this;

    vm.searchData = {
      latitude: 31.2526875973,
      longitude: 120.7334545490,
      key: ''
    }
    vm.currentLocation = locationService.getTarget()
    vm.setCurrentBoard = setCurrentBoard
    vm.searchLocation = searchLocation
    vm.clearHistory = clearHistory;

    getCupboards()
    getHistoryLocation()

    function getCupboards() {
      locationService.getCupboards().then(function (rel) {
        vm.nearbyCupboards = rel
      })
    }

    function setCurrentBoard(board) {
      locationService.setTarget(board)
      setHistoryLocation(board)
      // $ionicHistory.goBack();
      $state.go('home');
    }
    
    function getHistoryLocation() {
      var locationHistory = $window.localStorage.getItem('qd-location-history') || [];
      if (typeof locationHistory === 'string') {
        locationHistory = angular.fromJson(locationHistory);
      }
      vm.locationHistries = locationHistory;
    }

    function setHistoryLocation(board) {
      for (var history in vm.locationHistries) {
        if (vm.locationHistries[history].id === board.id) {
          vm.locationHistries.splice(history, 1);
        }
      }
      vm.locationHistries.push(board)
      $window.localStorage.setItem('qd-location-history', angular.toJson(vm.locationHistries))
    }

    function searchLocation(e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode !== 13 || vm.searchData.key === '') {
        return;
      }
      $state.go('locationSearch', {
        key: vm.searchData.key
      });
    }

    function clearHistory() {
      vm.locationHistries = []
      $window.localStorage.removeItem('qd-location-history');
    }
  }
})();
