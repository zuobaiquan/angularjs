(function() {
    'use strict';
    angular.module('BlurAdmin.pages.index')
        .controller('resetPswdCtrl', resetPswdCtrl);

    /** @ngInject */
    function resetPswdCtrl($scope, apiRequest,adminService, $uibModalInstance, toastr, modal,md5) {
        $scope.modal = modal;
        $scope.submit = function() {
            if (!angular.equals(modal.params.newpass, modal.params.renewpass)) {
                toastr.error("输入密码不一致，请重新输入", "");
                return;
            }
            else {
                var par={
                    accountId:adminService.getAdmin().account.id,
                    newpass:md5.createHash(modal.params.newpass),
                    oldpass:md5.createHash(modal.params.oldpass)
                }
                apiRequest.post("/shopAdmin/Account/edit-password", par, function(res) {
                    if (res.code == "200") {
                        toastr.success(modal.success);
                        $uibModalInstance.close("success");
                    } else {
                        toastr.error(res.message, '');
                        $scope.$apply();
                    }
                },function(err){
                	toastr.error(err.message, "");
                });
            }
        };
    }
})();
