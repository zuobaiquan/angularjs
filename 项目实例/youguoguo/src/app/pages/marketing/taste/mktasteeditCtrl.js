(function() {
    'use strict';
    angular.module('BlurAdmin.pages.marketing')
        .controller('mktasteeditCtrl', mktasteeditCtrl);
    function mktasteeditCtrl($scope,$state,toastr,$timeout,modal,IMAGE_UPLOAD,$uibModalInstance, apiRequest,modalsService) {
        $scope.modal = modal;
        var vm = this;
        vm.init = init;
        $scope.isTaste=true;
        $scope.searchcon="";
        $scope.type=0;
        $scope.disable=false;
        $scope.isChageType=function(type){
            $scope.type = type;
            if(type==1){
                $scope.isTaste=false;
            }
            else{
                $scope.isTaste=true;
            }
        }

        if(modal.op=='add'){
            $scope.isedit=true;
            $scope.modal={
                title:modal.title,
                params:{
                    projectId:0,
                    title: '',
                    subhead:'',
                    picture:'',
                    url:'',
                    sort:0,
                }
            }
        }
        if(modal.op=='edit'){
            $scope.isedit=false;
            $scope.modal = {
                title:modal.title,
                params: {
                    id:modal.data.id,
                    picture:modal.data.picture,
                    subhead:modal.data.subhead,
                    title: modal.data.title,
                    url:modal.data.url,
                    projectId:modal.data.projectId,
                    sort:modal.data.sort,
                    status:modal.data.status
                }
            };
            if(isNaN(modal.data.projectId)){
                $scope.type=1;
                $scope.isTaste=false;
            }
            else{
                $scope.type=0;
                $scope.isTaste=true;
                $scope.searchcon=modal.data.projectName;
            }
        }

        $scope.$watch('searchcon', function(newValue, oldValue) {
            console.log('contentchange', newValue, oldValue);
            if (newValue != oldValue) {
                $scope.tasteListAll();
            }
        });

        $scope.tasteListAll=function(){
            var params ;
            if (!$scope.searchcon) {params = { key:""};}
            else {params = {key: $scope.searchcon};}
            apiRequest.post('/admin/newest/load-project', params, function(res) {
                $scope.tasteList = res.data;
            });
        }

        $scope.isShowUllist=false;
        $scope.projectIdClick = function(index,name){
            $scope.isShowUllist=false;
            $scope.modal.params.projectId=index;
            $scope.searchcon=name;
            console.log(index);
        }
        $scope.removeCon=function(){
            $scope.searchcon="";
            $scope.isShowUllist=true;
        }

        $scope.hideUlist=function(){
            //让点击事件延迟
            $timeout(function(){
                $scope.isShowUllist=false;
            },200);
        }

        $scope.delTaste=function(id){
          $scope.modal = {
              url: "/admin/newest/edit-status",
              title: "确认信息",
              success: "删除成功",
              message: "您确定删除您选中的项吗？",
              params: {
                  id: id
              }
          };
          modalsService.callback($scope.modal,function(){
            $uibModalInstance.close();
            $state.reload();
          });
        }

        $scope.submit=function(){
            //如果是体验
            if($scope.type==0){
                delete $scope.modal.params.url;
                if(!$scope.modal.params.projectId){
                    toastr.error('请下拉选择体验项', '', {});
                    return false;
                }
            }
            if($scope.type==1){
                delete $scope.modal.params.projectId;
            }
            $scope.disable=true;
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

        function init() {
            vm.token = IMAGE_UPLOAD.token;
            vm.link = IMAGE_UPLOAD.link;
        }
        vm.key = {
            value: null
        };
    }

})();
