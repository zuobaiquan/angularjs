(function() {
    'use strict';
    angular.module('BlurAdmin.pages.business')
        .controller('membereditCtrl', membereditCtrl);

    /** @ngInject */
    function membereditCtrl($scope, $state,apiRequest,$uibModalInstance,modal,modalsService,toastr) {
        $scope.getInfo = function() {
            apiRequest.post('/admin/Account/accounDetail', { accountId: modal.params.id}, function(res) {
                if (res.code == "200") {
                    $scope.memberInfo = res.data;
                }else{
                    toastr.error(res.message, 'Error');
                    $scope.$apply();
                }
            });
            $scope.getAllAccountId();
        }

        $scope.isShowcg=function(id){
            $scope.setType = id;
        }
        $scope.submitsetAccount=function(){
            //切换radio的值
            $scope.setType=$scope.setType||1;
            apiRequest.post(modal.url, { accountId: modal.params.id,type:$scope.setType}, function(res) {
                if (res.code == "200") {
                    toastr.success('已封号');
                    $uibModalInstance.close("success");
                    $state.reload();
                }else{
                    toastr.error(res.message, 'Error');
                    $scope.$apply();
                }
            });
        }

        $scope.companyType =[
            { type: 1, des: "发布色情/政治/违法/暴恐内容" }
            //{ type: 2, des: "被骗钱" },
            //{ type: 3, des: "被骚扰了(垃圾信息、谩骂)" }
        ];

        $scope.selected=1;
        $scope.change_sel=function(selected){
            $scope.selected=selected;
        }

        $scope.submitWarning=function(){
            $scope.warningType=$scope.warningType||1;
            apiRequest.post(modal.url, { accountId: modal.params.id,message:$scope.selected}, function(res) {
                if (res.code == "200") {
                    toastr.success('已警告');
                    $uibModalInstance.close("success");
                    //$state.reload();
                }else{
                    toastr.error(res.message, 'Error');
                    $scope.$apply();
                }
            });
        }

        $scope.authText=function(dignityList){
            if(dignityList==''){
                return "果果达人未认证，果果店家未认证";
            }
            var count=0;
            //这里为什么取不了length！！！
            for(var item in dignityList){
               count++;
            }
            if(count==2){
                return "果果达人已认证，果果店家已认证";
            }
            if(count==1){
                if(dignityList[0].name=='店家'){
                    return "果果达人未认证，果果店家已认证";
                }
                else{
                    return "果果达人已认证，果果店家未认证";
                }
            }
        }
        $scope.getAllAccountId=function(){
            apiRequest.post('/admin/Account/getAllAccountId', {}, function(res) {
                if (res.code == "200") {
                    $scope.accountId= res.data;
                    console.log(res.data);
                }
            },function(err){
                toastr.error(err.message, '');
                return ;
            });
        }
        $scope.getmember=function(id,isnext){
            var len=$scope.accountId.length;
            for(var i=0;i<$scope.accountId.length;i++){
                if($scope.accountId[i]==id){
                    console.log($scope.accountId[i],i);
                    break;
                }
            }
            var aid=$scope.accountId[i+isnext];
            console.log("i",i,"aid",aid);
            if((i==(len-1))&&isnext==1){
                aid=$scope.accountId[0];
            }
            if(i==0&&isnext==-1){
                aid=$scope.accountId[len-1];
            }
            apiRequest.post('/admin/Account/accounDetail', { accountId:aid }, function(res) {
                if (res.code == "200") {
                    $scope.memberInfo = res.data;
                }
            },function(err){
                toastr.error(err.message, '');
                return ;
            });
        }


        $scope.setAccount=function(id){
            $scope.modal = {
                url:'/admin/Account/sealAccount',
                params: {
                    id:id
                }
            };
            modalsService.normal('app/pages/business/member/setaccount.html','membereditCtrl',$scope.modal,function(){});
        }

        $scope.setWarning=function(id){
            $scope.modal = {
                url:'/admin/Account/warningAccount',
                params: {
                    id:id
                }
            };
            modalsService.normal('app/pages/business/member/addwarning.html','membereditCtrl',$scope.modal,function(){});
        }
    }
})();