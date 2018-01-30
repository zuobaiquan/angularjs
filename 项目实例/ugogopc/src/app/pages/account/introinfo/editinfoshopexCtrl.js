(function() {
    'use strict';
    angular.module('BlurAdmin.pages.account')
        .controller('editinfoshopexCtrl', editinfoshopexCtrl);

    /** @ngInject */
    function editinfoshopexCtrl($scope,$state,$stateParams,apiRequest,toastr,modalsService,adminService,QINIU_LINK,IMAGE_UPLOAD) {
        if($stateParams.item==null){
            $state.go("account.introinfo",{}, {reload: true});
        }
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

        if($stateParams.item.shop!=null){
            $scope.introinfo={
                intro:$stateParams.item.shop.shopIntroduce,
                name:$stateParams.item.shop.shopName,
            }
            $scope.introinfo.avatar=$stateParams.item.shop.avatar==null?'./assets/img/image-180.png':$stateParams.item.shop.avatar;
        }
        if($stateParams.item.shop==null){
            $scope.introinfo={
                intro:$stateParams.item.expertPerson.personIntro,
                name:$stateParams.item.expertPerson.realName,
            }
            $scope.introinfo.avatar=$stateParams.item.expertPerson.avatar==null?'./assets/img/image-180.png':$stateParams.item.expertPerson.avatar;
        }
        $scope.checkinput=function(){
            if($scope.introinfo.avatar==''){
                toastr.error('头像不能为空', '', {});
                return false;
            }
            if($scope.introinfo.name==''){
                toastr.error('介绍名称不能为空', '', {});
                return false;
            }
            if($scope.introinfo.intro==''){
                toastr.error('简介不能为空', '', {});
                return false;
            }
            else{
                return true;
            }
        }

        $scope.submitshopex=function(){
            if($scope.checkinput()) {
                apiRequest.post('/shopAdmin/Account/updateShopOrEp',
                    {
                        accountId: adminService.getAdmin().account.id,
                        avatar: $scope.introinfo.avatar,
                        name: $scope.introinfo.name,
                        intro:$scope.introinfo.intro
                    }, function (res) {
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
