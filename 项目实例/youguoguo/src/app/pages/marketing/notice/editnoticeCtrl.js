/**
 * @author a.demeshko
 * created on 18.01.2016
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.marketing')
        .controller('editnoticeCtrl', editnoticeCtrl);

    function editnoticeCtrl($scope,$state,toastr,apiRequest,modalsService) {
        $scope.disable = false;
        $scope.sysPushRequest={
            title:'',
            pushTarget:"",
            // picture:'',
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
            if($scope.sysPushRequest.title==''){
                toastr.error("推送主题不能为空", '');
                return;
            }
            // if($scope.sysPushRequest.picture==''){
            //     toastr.error("推送图片不能为空", '');
            //     return;
            // }
            if($scope.sysPushRequest.pushContext==''){
                toastr.error("推送内容不能为空", '');
                return;
            }
            $scope.sysPushRequest.pushTarget=$scope.temppushTarget.join(",");
            if($scope.sysPushRequest.pushTarget==""){
                toastr.error("请选择推送对象", '');
                return;
            }
            console.log($scope.sysPushRequest);
            $scope.disable = true;
            apiRequest.postJson('/admin/sysPush/add-sysPush', $scope.sysPushRequest, function(res) {
                if (res.code == "200") {
                    toastr.success('添加成功');
                    $state.go("marketing.notice",{}, {reload: true});

                }else {
                  $scope.disable = false;
                    toastr.error(res.message, '');
                    $scope.$apply();
                }
            });
        };
    }
})();
