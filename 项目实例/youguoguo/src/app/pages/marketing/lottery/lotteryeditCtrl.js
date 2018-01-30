(function() {
    'use strict';
    angular.module('BlurAdmin.pages.marketing')
        .controller('lotteryeditCtrl', lotteryeditCtrl);

    function lotteryeditCtrl($scope, $state,apiRequest,$uibModalInstance,modal,modalsService,toastr,baUtil) {
      $scope.modal=modal;
      $scope.disable = false;
	    $scope.olddate=modal.params.date;
      $scope.startDateBeforeRender = function($dates) {
          var todaySinceMidnight = new Date();
          todaySinceMidnight.setUTCHours(0,0,0,0);
          $dates.filter(function (date) {
            return date.utcDateValue < todaySinceMidnight.getTime();
          }).forEach(function (date) {
            date.selectable = false;
          });
      };
      $scope.submit = function(){
          $scope.disable = true;
    		  if(modal.params.date==""){
    			     toastr.error("请选择抽奖时间", '');
                return ;
    		  }
          for(var item in modal.datatime){
            if((modal.datatime[item].date==modal.params.date)&&($scope.olddate!==modal.params.date)){
                toastr.error("该时间段已经被占用", '');
                return ;
            }
          }
          apiRequest.postJson(modal.url,modal.params,function(res){
              toastr.success(modal.success);
              $uibModalInstance.close("success");
          },function(err){
              toastr.error(err.message, '');
              $scope.disable = false;
          });
      };
      $scope.editsub = function(){
          apiRequest.postJson(modal.url,modal.params.totalarr,function(res){
              toastr.success(modal.success);
              $uibModalInstance.close("success");
          },function(err){
              toastr.error(err.message, '');
          });
      };
    }
})();
