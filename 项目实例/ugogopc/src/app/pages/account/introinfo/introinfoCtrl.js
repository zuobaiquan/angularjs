(function() {
    'use strict';
    angular.module('BlurAdmin.pages.account')
        .controller('introinfoCtrl', introinfoCtrl);

    function introinfoCtrl($scope, $state,apiRequest,modalsService,adminService) {
        $scope.getList = function() {
            var params = {
                accountId:adminService.getAdmin().account.id,
            };
            $scope.showshop=false;
            $scope.showexport=false;
            $scope.showisadd=false;
            apiRequest.post('/shopAdmin/Account/introDetail', params, function(res) {
                $scope.tableData = res.data;
                if(res.data.shop==null){
                    $scope.showexport=true;
                    $scope.infotitle="达人介绍";
                    if(res.data.expertPerson.avatar==null){
                        $scope.showisadd=true;
                    }
                }
                if(res.data.expertPerson==null){
                    $scope.showshop=true;
                    $scope.infotitle="店家介绍";
                    if(res.data.shop.avatar==null){
                        $scope.showisadd=true;
                    }
                }
            });
        };


        $scope.deleteTeacher=function(id){
            $scope.modal = {
                url: "/shopAdmin/TeacherIntro/deleteTeacherIntro",
                title: "确认信息",
                success: "该老师信息已删除",
                message: "您确定要删除该老师信息吗？",
                params: {
                    teacherId: id,
                }
            };
            modalsService.callback($scope.modal,function(){
                $scope.getList();
            });
        }

        $scope.goToaddpage=function(item){
            $state.go("account.introinfo-editshopex",{item:item},{reload: true});
        }
        $scope.goToteacherpage=function(){
            $state.go("account.introinfo-add",{},{reload: true});
        }
    }

})();