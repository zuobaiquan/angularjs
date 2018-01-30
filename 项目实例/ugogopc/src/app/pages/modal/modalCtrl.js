/**
 * @author a.demeshko
 * created on 18.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages')
    .controller('ModalCtrl', ModalCtrl);

  /** @ngInject */
  function ModalCtrl($scope, $state,apiRequest, $uibModalInstance,toastr,modal) {
    $scope.disable = false;
    $scope.modal = modal;

    $scope.submit = function(){
      $scope.disable = true;
      apiRequest.post(modal.url,modal.params,function(res){
          toastr.success(modal.success);
          $uibModalInstance.close("success");
      },function(err){
          toastr.error(err.message, '');
          $scope.disable = false;
      });
    };
    $scope.goTolink=function(){
        if(typeof $scope.modal.id!='undefined'){
            $state.go($scope.modal.link,{id:$scope.modal.id}, {reload: true});
            $uibModalInstance.close();
        }
        else{
            $state.go($scope.modal.link,{}, {reload: true});
            $uibModalInstance.close();
        }
    }

  }

})();
