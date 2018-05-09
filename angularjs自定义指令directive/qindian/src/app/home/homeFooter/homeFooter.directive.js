(function () {
  'use strict';

  angular
    .module('starter.home')
    .directive('homeFooter',homeFooter);
  
  function homeFooter() {
    return {
      templateUrl: 'app/home/homeFooter/homeFooter.html',
      controller: 'HomeFooterCtrl'
    }
  }
})();