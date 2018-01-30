/**
 * @author a.demeshko
 * created on 18.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.contest')
    .controller('tabledetailCtrl', tabledetailCtrl);

  /** @ngInject */
  function tabledetailCtrl($scope,$state,apiRequest,toastr,modal,modalsService) {
      $scope.modal = modal;
      $scope.init = function() {
        apiRequest.post('/admin/maths/detail', { id: modal.params.id }, function(res) {
            if (res.code == "200") {
              $scope.tableData=res.data;
            } else {
              toastr.error(res.message, '');
              $scope.$apply();
            }
        },function(res2){
            toastr.error(res2.message, '');
        });
    }

    $scope.getTableNum=function(id,index){
      modal.params.id=id;
      $scope.init();
    }
  }

})();
