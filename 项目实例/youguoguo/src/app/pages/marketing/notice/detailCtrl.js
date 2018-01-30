(function () {
  'use strict';

  angular.module('BlurAdmin.pages.marketing')
    .controller('detailCtrl', detailCtrl);

  /** @ngInject */
  function detailCtrl($scope,modal) {
      $scope.modal = {
          content: modal.content,
          // picture:modal.picture,
          title: modal.title,
      };

  }
angular.module('BlurAdmin.pages.marketing')
    .filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
})();
