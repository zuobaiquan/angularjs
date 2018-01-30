
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.marketing')
        .controller('editshortmesCtrl', editshortmesCtrl);

    function editshortmesCtrl($scope,$state,toastr,apiRequest,modalsService) {
        $scope.disable = false;
        $scope.notePushRequest={
            pushTarget:"",
            pushContext:''
        }
        $scope.temppushTarget=[];
        $scope.isShowcg=function(item,value){
            if(item){
                for(var i=0;i<$scope.temppushTarget.length;i++){
                    if(value==$scope.temppushTarget[i]){
                        return ;
                    }
                }
                $scope.temppushTarget.push(value);
            }
            else{
                for(var i=0;i<$scope.temppushTarget.length;i++){
                    if(value==$scope.temppushTarget[i]){
                        $scope.temppushTarget.splice(i,1);
                    }
                }
            }
        }
        $scope.confirm = function(link) {
            $scope.modal = {
                link: link,
            }
            modalsService.normal('app/pages/modal/confirm.html','ModalCtrl',$scope.modal,function(){});
        };

        $scope.submit = function() {
            if($scope.notePushRequest.pushContext==''){
                toastr.error("推送内容不能为空", '');
                return;
            }
            $scope.notePushRequest.pushTarget=$scope.temppushTarget.join(",");
            if($scope.notePushRequest.pushTarget==""){
                toastr.error("请选择推送对象", '');
                return;
            }
            console.log($scope.notePushRequest);
            $scope.disable = true;
            apiRequest.postJson('/admin/notePush/add-notePush', $scope.notePushRequest, function(res) {
                if (res.code == "200") {
                    toastr.success('添加成功');
                    $state.go("marketing.shortmes",{}, {reload: true});
                }else {
                    toastr.error(res.message, '');
                    $scope.$apply();
                }
            });
        };
    }
})();
