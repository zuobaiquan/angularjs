(function () {
  'use strict';

  angular
    .module('starter.home')
    .controller('HomeFooterCtrl', HomeFooterCtrl);
    
  function HomeFooterCtrl ($scope, $ionicPopup) {
    $scope.isShowCart = false;
    $scope.showPopup = function () {
      $scope.isShowCart = !$scope.isShowCart
    };
  };
})();