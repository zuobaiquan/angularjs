(function() {
    'use strict';
    angular.module('BlurAdmin.pages.business')
        .controller('tasteeditCtrl', tasteeditCtrl);

    function tasteeditCtrl($scope, $state,apiRequest,$uibModalInstance,modal,modalsService,toastr) {
        $scope.getInfo = function() {
            apiRequest.post('/admin/project/loadProjectById', { projectId: modal.params.id}, function(res) {
                if (res.code == "200") {
                    $scope.tasteInfo = res.data;
                    if(res.data.shop==null){
                        if(res.data.expertPerson!=null){
                            $scope.exinfo=res.data.expertPerson;
                            $scope.exdata=true;
                        }
                        else{
                            $scope.exshopdata=false;
                        }
                    }
                    if(res.data.expertPerson==null){
                        if(res.data.shop!=null){
                            $scope.shopinfo=res.data.shop;
                            $scope.shopdata=true;
                        }
                        else{
                            $scope.shopdata=false;
                        }
                    }

                    if(res.data.teacherIntro!=null){
                        $scope.teacherIntro=res.data.teacherIntro;
                        $scope.showTeacher=true;
                    }
                    else{
                        $scope.showTeacher=false;
                    }


                } else {
                    toastr.error(res.message, 'Error');
                    $scope.$apply();
                }
            });
        }

        $scope.timeSubstring=function(start,stop,str){
            return str.substring(start,stop);
        }

        $scope.getFiletype=function(url) {
            var filetype=url.split("?id=");
            return filetype[1];
        }

        $scope.testArealine=function(con){
            console.log(con);
            var arrtext=con.split("\n");
            $scope.projectnote=arrtext;
        }


		$scope.typeText=function(type){
			if(type==1){

			}
			if(type==2){
				return "全年无休";
			}
			if(type==3){
				return "工作日";
			}
			if(type==4){
				return "周末或假期";
			}
		}
        $scope.refuseTaste=function(id){
            $uibModalInstance.close("success");
            $scope.modal = {
                url: "/admin/project/rejectProject",
                title: "驳回备注",
                success: "驳回理由已填写",
                params: {
                    id: id,
                    reason:''
                }
            };
            modalsService.normal('app/pages/market/store/addreason.html','ModalCtrl',$scope.modal,function(){
                $state.reload();
            });
        }
        $scope.passTaste=function(id){
            apiRequest.post('/admin/project/passProject', { id:id }, function (res) {
                if (res.code == "200") {
                    toastr.success('审核提交成功');
                    $uibModalInstance.close("success");
                    $state.reload();
                } else {
                    toastr.error(res.message, '');
                    $scope.$apply();
                }
            });
        }
    }

    angular.module('BlurAdmin.pages.business')
        .filter('to_trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }]);

})();
