
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.system')
    .controller('resetpassCtrl', resetpassCtrl);

  function resetpassCtrl($scope, $state,apiRequest,$uibModalInstance,toastr,modal) {
    $scope.disable = false;
    $scope.modal = modal;
    $scope.submit = function(){
        $scope.disable = true;
        apiRequest.get(modal.url,{id:modal.id},function(res){
            toastr.success(modal.success);
            $uibModalInstance.close("success");
        },function(err){
            toastr.error(err.message, '');
            $scope.disable = false;
        });
    };
  }
})();
