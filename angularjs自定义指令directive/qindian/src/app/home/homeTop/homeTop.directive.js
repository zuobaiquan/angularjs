(function () {
  'use strict';

  angular.module('starter.home')
    .directive('homeTop',homeTop)
  
  function homeTop() {
    return {
      templateUrl: 'app/home/homeTop/homeTop.html',
      replace: true,
      controller: 'HomeConCtrl',
    }
  }
})();