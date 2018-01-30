(function() {
    'use strict';
    angular.module('BlurAdmin.pages.marketing')
        .controller('lotteryconfigCtrl', lotteryconfigCtrl);
    function lotteryconfigCtrl($scope,toastr,apiRequest,baUtil,modalsService) {
        $scope.getList = function() {
            $scope.isLoading = true; //默认为读取数据状态中
            apiRequest.post('/admin/lottery-activity/list', {}, function(res) {
                $scope.tableData = res.data.configs;
                $scope.remainData = res.data.remain;
                $scope.totalData = res.data.total;
                $scope.isLoading = false;
            });
        };
        $scope.showDatetext=function(datetime){
          datetime+="";
          var month=parseInt(datetime.substring(5,7));
          var day=parseInt(datetime.substring(8,10));
          return month+"月"+day+"日";
        }

        $scope.addLottery=function(datatime){
            $scope.modal = {
                url: "/admin/lottery-activity/add",
                title: "添加抽奖日期",
                success: "添加成功",
                datatime:datatime,
                params: {
                    date:"",
                    idle:null,
                    prize:[0,0,0,0,0]
                }
            };
            modalsService.normal('app/pages/marketing/lottery/addlottery.html','lotteryeditCtrl',$scope.modal,function(){$scope.getList();});
        }
        $scope.editLottery = function(item,datatime){
            $scope.modal = {
              url: "/admin/lottery-activity/update",
              title: "修改抽奖信息",
              success: "修改成功",
              datatime:datatime,
              params: {
                  id: item.id,
                  date:item.date,
                  idle:item.idle,
                  prize:item.prize
              }
            };
            modalsService.normal('app/pages/marketing/lottery/addlottery.html','lotteryeditCtrl',$scope.modal,function(){
                $scope.getList();
            });
        }
        $scope.editLotterytotal = function(item){
            $scope.modal = {
              url: "/admin/lottery-activity/config-total-prize",
              title: "修改奖品总数量",
              success: "修改成功",
              params: {
                  totalarr:item
              }
            };
            modalsService.normal('app/pages/marketing/lottery/editlotterytotal.html','lotteryeditCtrl',$scope.modal,function(){
                $scope.getList();
            });
        }

    }

})();
