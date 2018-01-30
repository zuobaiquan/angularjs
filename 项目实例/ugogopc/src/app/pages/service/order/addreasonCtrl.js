
(function () {
  'use strict';

  angular.module('BlurAdmin.pages')
    .controller('addreasonCtrl', addreasonCtrl);

  function addreasonCtrl($scope,apiRequest, $uibModalInstance,toastr,modal) {
    $scope.disable = false;
    $scope.modal = modal;
    $scope.reasoninput="";
    $scope.submit = function(){
        for(var i=0;i<$scope.rangeServicelist.length;i++){
            if($scope.rangeServicelist[i].ischoose==true){
                if($scope.reasoninput!=""){
                    modal.params.reason+="、"+$scope.reasoninput;
                }
                $scope.addRefuse();
                return ;
            }
        }
        if($scope.reasoninput==""){
            toastr.error("请选中拒绝理由或填写拒绝原因", '');
            return ;
        }
        else{
            modal.params.reason=$scope.reasoninput;
            $scope.addRefuse();
            return ;
        }

    };
    $scope.addRefuse=function(){
        apiRequest.post(modal.url,modal.params,function(res){
            toastr.success(modal.success);
            $uibModalInstance.close("success");
        },function(err){
            toastr.error(err.message, '');
            $scope.disable = false;
        });
    }
    $scope.rangeServicelist=[{id:1,ischoose:false,typeName:'有应急事务'},{id:2,ischoose:false,typeName:'天气不合适'},{id:3,ischoose:false,typeName:'路段有状况'},{id:4,ischoose:false,typeName:'老师无法到场'},{id:5,ischoose:false,typeName:'临时调整'}];
    $scope.changeStyle=function(id,typename,ischoose){
        if(ischoose){
            angular.element("body").find("#"+id).css({"borderColor":"#dddddd"});
            modal.params.reason="";
            $scope.rangeServicelist[id-1].ischoose=false;
            return ;
        }
        for(var i=1;i<=$scope.rangeServicelist.length;i++){
            if(i!=id){
                angular.element("body").find("#"+i).css({"borderColor":"#dddddd"});
                modal.params.reason=typename;
            }
            else{
                angular.element("body").find("#"+i).css({"borderColor":"#0066FF"});
                $scope.rangeServicelist[i-1].ischoose=true;
            }
        }
    }

  }

})();
