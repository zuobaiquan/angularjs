(function () {
  'use strict';

  angular.module('starter.home')
    .directive('homeCon',homeCon)
  
  function homeCon() {
    return {
      templateUrl: 'app/home/homeCon/homeCon.html',
      controller: 'HomeConCtrl',
      replace: true
    }
  }
})();