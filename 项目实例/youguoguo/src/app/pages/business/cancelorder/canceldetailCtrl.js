(function() {
    'use strict';
    angular.module('BlurAdmin.pages.business')
        .controller('canceldetailCtrl', canceldetailCtrl);

    function canceldetailCtrl($scope,apiRequest,toastr,$state,modal,baUtil,$uibModalInstance,modalsService) {
      $scope.modal=modal;
      $scope.getInfo=function(){
        apiRequest.post('/admin/order/refund/refund-detail', {id:modal.params.id}, function(res) {
            if (res.code == "200") {
                $scope.cancelDetail=res.data;
                $scope.modal.id=$scope.cancelDetail.id;
            } else {
                toastr.error(res.message, '');
                $scope.$apply();
            }
        });
      }

      $scope.handeImg=function(str){
        str+="";
        return str.split(",");
      }

      $scope.revokePay=function(id){
        $scope.modal = {
            url:'/admin/order/refund/service-manage',
            success:'撤销成功',
            params: {
              type:1,
              explain:'',
              orderId:id,
            }
        };
        modalsService.normal('app/pages/business/cancelorder/addreason.html','ModalCtrl',$scope.modal,function(){
          $uibModalInstance.close("success");
          $state.reload();
        });
      }
      $scope.agreePay=function(id){
        $scope.modal = {
            url:'/admin/order/refund/service-manage',
            success:'同意成功',
            params: {
              type:0,
              orderId:id,
            }
        };
        modalsService.normal('app/pages/modal/cancleconfirm.html','ModalCtrl',$scope.modal,function(){
          $uibModalInstance.close("success");
          $state.reload();
        });
      }
    }

})();
