(function() {
    'use strict';
    angular.module('BlurAdmin.pages.account')
        .controller('editinfoCtrl', editinfoCtrl);

    /** @ngInject */
    function editinfoCtrl($scope, $state,$stateParams,apiRequest,toastr,modalsService,adminService,QINIU_LINK,IMAGE_UPLOAD) {
        var vm = this;
        vm.init = init;
        vm.key = {
            value: null
        };
        $scope.confirm = function(link) {
            $scope.modal = {
                link: link,
            }
            modalsService.normal('app/pages/modal/confirm.html','ModalCtrl',$scope.modal,function(){});
        };

        $scope.teacherIntro={
            accountId:adminService.getAdmin().account.id,
            avatar:'',
            intro:'',
            name:'',
        }
        if($stateParams.item!=null){
            $scope.teacherIntro=$stateParams.item;
        }

        $scope.checkinput=function(){
            if($scope.teacherIntro.avatar==''){
                toastr.error('头像不能为空', '', {});
                return false;
            }
            if($scope.teacherIntro.name==''){
                toastr.error('介绍名称不能为空', '', {});
                return false;
            }
            if($scope.teacherIntro.intro==''){
                toastr.error('简介不能为空', '', {});
                return false;
            }
            else{
                return true;
            }
        }


        $scope.submitInfo=function(){
            if($scope.checkinput()){
                apiRequest.postJson('/shopAdmin/TeacherIntro/addTeacherIntro',$scope.teacherIntro,function(res){
                    if(res.code == "200") {
                        toastr.success('添加成功');
                        $state.go("account.introinfo",{}, {reload: true});
                    }else {
                        toastr.error(res.message, '');
                        $scope.$apply();
                    }
                });
            }
            else{
                console.log("表单输入错误");
            }

        }

        $scope.updateInfo=function(){
            if($scope.checkinput()) {
                apiRequest.postJson('/shopAdmin/TeacherIntro/updateTeacherIntro', $scope.teacherIntro, function (res) {
                    if (res.code == "200") {
                        toastr.success('修改成功');
                        $state.go("account.introinfo", {}, {reload: true});
                    } else {
                        toastr.error(res.message, '');
                        $scope.$apply();
                    }
                });
            }
            else{
                console.log("表单输入错误");
            }
        }

        function init() {
            vm.token = IMAGE_UPLOAD.token;
            vm.link = QINIU_LINK;
        }
    }

})();