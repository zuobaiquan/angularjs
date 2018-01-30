(function () {
  'use strict';

  angular.module('BlurAdmin.pages.baseconfig')
    .controller('abroaddetailCtrl', abroaddetailCtrl);

  /** @ngInject */
  function abroaddetailCtrl($scope,modal) {
      $scope.modal = modal;
      $scope.pic=modal.picture;
      $scope.title=modal.title;
  }
})();