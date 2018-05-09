(function () {
  'use strict';

  angular.module('starter.home').directive('homeCart', homeCart)

  function homeCart() {
    return {
      templateUrl: 'app/home/homeCart/homeCart.html',
      replace: true,
      
    };
  }
})();