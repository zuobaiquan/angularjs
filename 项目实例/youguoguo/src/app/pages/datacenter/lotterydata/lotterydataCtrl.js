(function() {
    'use strict';
    angular.module('BlurAdmin.pages.datacenter')
        .controller('lotterydataCtrl', lotterydataCtrl);
    function lotterydataCtrl($scope,apiRequest) {
        $scope.getList = function(tableState) {
            $scope.isLoading = true; //默认为读取数据状态中
            apiRequest.post('/admin/lottery-activity/prize-list', {}, function(res) {
                $scope.tableData = res.data;
                $scope.isLoading = false;
            });
        };
        $scope.prizeText=function(index){
          if(index==0){
            return "未中奖";
          }
          if(index==1){
            return "一等奖";
          }
          if(index==2){
            return "二等奖";
          }
          if(index==3){
            return "三等奖";
          }
          if(index==4){
            return "四等奖";
          }
          if(index==5){
            return "五等奖";
          }
        }

    }
})();
