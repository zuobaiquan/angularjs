(function() {
    'use strict';
    angular.module('BlurAdmin.pages.business')
        .controller('commenteditCtrl', commenteditCtrl);

    function commenteditCtrl($scope, $state,$uibModalInstance,apiRequest,modal,toastr,modalsService) {
        $scope.deletecomment=function(id){
            $scope.modal = {
                url:'/admin/Account/warningAccount',
                params: {
                    id:id
                }
            };
            modalsService.normal('app/pages/business/comment/delreason.html','commentCtrl',$scope.modal,function(){});
        }

        $scope.isShowcg=function(id){
            $scope.setreasonid = id;
        }
        
        $scope.delComment=function(){
            $scope.setreasonid=$scope.setreasonid||1;
            apiRequest.post(modal.url, { id: modal.params.id,reason:$scope.setreasonid}, function(res) {
                if (res.code == "200") {
                    toastr.success('已删除');
                    $uibModalInstance.close("success");
                    $state.reload();
                }else{
                    toastr.error(res.message, 'Error');
                    $scope.$apply();
                }
            });
        }
    }

})();