(function() {
    'use strict';
    angular.module('BlurAdmin.pages.marketing')
        .controller('vouchereditCtrl', vouchereditCtrl);

    function vouchereditCtrl($scope, $state,apiRequest,$uibModalInstance,modal,modalsService,toastr,baUtil) {
      $scope.scopeList =[
          { id: 0, name: "全平台" }
      ];
      $scope.modal=modal;
      $scope.useRange=0;
      $scope.disable=false;
      $scope.changeScope=function(){

      }
      // $scope.checkgetWays=function(getWaysphone){
      //   modal.params.getWays=getWaysphone?0:1;
      // }

      $scope.submit = function(){
          if(modal.params.startTime==""){
            toastr.error("开始时间不能为空", '');
            return ;
          }
          if(modal.params.endTime==""){
            toastr.error("结束时间不能为空", '');
            return ;
          }
          if ((modal.params.startTime!="")||(modal.params.endTime!="")) {
              var resVerify=baUtil.verifyTime(modal.params.startTime,modal.params.endTime);
              if(typeof resVerify!=='undefined'){
                  toastr.error(resVerify, '');
                  return ;
              }
          }
          if(modal.params.startTime.substr(0,10)==modal.params.endTime.substr(0,10)){
            var starthour=parseInt(modal.params.startTime.substr(11,2));
            var endhour=parseInt(modal.params.endTime.substr(11,2));
            if(starthour>endhour){
              toastr.error("开始小时不能大于结束小时", '');
              return ;
            }
            if(starthour==endhour){
              var startsecond=parseInt(modal.params.startTime.substr(14,2));
              var endsecond=parseInt(modal.params.endTime.substr(14,2));
              if(startsecond>=endsecond){
                toastr.error("结束分钟应该大于开始分钟", '');
                return ;
              }
            }
          }
          $scope.disable=true;
          apiRequest.postJson(modal.url,modal.params,function(res){
              toastr.success(modal.success);
              $uibModalInstance.close("success");
          },function(err){
              toastr.error(err.message, '');
              $scope.disable = false;
          });
      };
    }
})();
