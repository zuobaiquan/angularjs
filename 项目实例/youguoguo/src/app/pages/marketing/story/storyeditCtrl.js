(function() {
    'use strict';
    angular.module('BlurAdmin.pages.marketing')
        .controller('storyeditCtrl', storyeditCtrl);

    function storyeditCtrl($scope,$state,toastr,modal,IMAGE_UPLOAD,$uibModalInstance,apiRequest,modalsService) {
        var vm = this;
        vm.init = init;
        $scope.modal = modal;
        $scope.disable=false;
        if(modal.op=='add'){
            $scope.isedit=true;
            $scope.modal={
                title:modal.title,
                params:{
                    picture:'',
                    title: '',
                    url:'',
                    type:0,
                    sort:0,
                }
            }
        }
        if(modal.op=='edit'){
            $scope.isedit=false;
            $scope.modal = {
                title:modal.title,
                params: {
                    id:modal.params.id,
                    picture:modal.params.picture,
                    title: modal.params.title,
                    url:modal.params.url,
                    type:modal.params.type,
                    sort:modal.params.sort,
                    status:modal.params.status
                }
            };
        }

        $scope.submit=function(){
            $scope.disable = true;
            apiRequest.postJson(modal.url, $scope.modal.params, function (res) {
                if (res.code == "200") {
                    toastr.success(modal.success);
                    $uibModalInstance.close();
                    $state.reload();
                } else {
                    $scope.disable=false;
                    toastr.error(res.message, '');
                    $scope.$apply();
                }
            });
        }

        $scope.delStory=function(id){
          $scope.modal = {
              url: "/admin/story/update-status",
              title: "确认信息",
              success: "删除成功",
              message: "您确定删除您选中的项吗？",
              params: {
                  storyId: id
              }
          };
          modalsService.callback($scope.modal,function(){
            $uibModalInstance.close();
            $state.reload();
          });
        }

        $scope.isShowcg=function(type){
            modal.params.type = type;
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
