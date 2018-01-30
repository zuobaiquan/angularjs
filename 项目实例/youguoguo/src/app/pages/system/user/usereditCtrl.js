(function() {
    'use strict';
    angular.module('BlurAdmin.pages.system')
        .controller('usereditCtrl', usereditCtrl);

    /** @ngInject */
    function usereditCtrl($scope,$state,toastr,modal,IMAGE_UPLOAD,$uibModalInstance,apiRequest,md5) {
        var vm = this;
        vm.init = init;
        if(modal.op=='add'){
            $scope.isedit=true;
            $scope.modal={
                params:{
                    avatar: "",
                    deptId: 0,
                    password: "",
                    phone:0,
                    realName: "",
                    roleId: 0,
                    username: ""
                }
            }
        }
        if(modal.op=='edit'){
            $scope.isedit=false;
            $scope.modal = {
                params: {
                    id:modal.params.id,
                    avatar:modal.params.avatar,
                    username: modal.params.username,
                    realName:modal.params.realName,
                    phone:modal.params.phone,
                    roleId:modal.params.roleId,
                    deptId:modal.params.deptId
                }
            };
            $scope.selrole=modal.params.roleId;
            $scope.seldepart=modal.params.deptId;
        }
        $scope.getSectionRole=function(){
            $scope.title=modal.title;
            apiRequest.post('/pub/admin/load-rdlist', {}, function(res) {
                $scope.rolelist=res.data.roleList;
                $scope.departlist=res.data.deptList;
            });
        }

        $scope.changeRole=function(selrole) {
            $scope.modal.params.roleId=selrole;
        }
        $scope.changeDp=function(seldepart) {
            $scope.modal.params.deptId=seldepart;
        }
        $scope.submit=function(){
			if(modal.op=='add'){
				$scope.modal.params.password=md5.createHash($scope.modal.params.password);
			}
            apiRequest.postJson(modal.url, $scope.modal.params, function (res) {
                if (res.code == "200") {
                    toastr.success(modal.success);
                    $uibModalInstance.close();
                    $state.reload();
                } else {
                    toastr.error(res.message, '');
                    $scope.$apply();
                }
            });
        }
        function init() {
            vm.token = IMAGE_UPLOAD.token;
            vm.link = IMAGE_UPLOAD.link;
        }
        vm.key = {
            value: null
        };
    }

})();
