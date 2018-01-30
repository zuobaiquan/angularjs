(function() {
    'use strict';
    angular.module('BlurAdmin.pages.business')
        .controller('cancelorderCtrl', cancelorderCtrl);

    function cancelorderCtrl($scope,apiRequest,$timeout,toastr,baUtil,modalsService ) {
        $scope.smartTable = {
            pageSize: 5,
            searchContent: '',
            start:"",
            end:"",
        }; //设置每页默认条数
        $scope.cancelStatus=1;
        $scope.cancelList=[
          {id:0,name:'未申请'},
          {id:1,name:'已申请'}
        ];
        $scope.changeStatus=function(){
          if($scope.cancelStatus==1){
            $scope.companyType =[
                { id: 4, des: "全部" },
                { id: 0, des: "未处理" },
                { id: 1, des: "客服同意退款" },
                { id: 2, des: "客服撤销退款" }
            ];
          }
          if($scope.cancelStatus==0){
            $scope.companyType =[
                { id: 4, des: "全部" },
                { id: 101, des: "未处理" },
                { id: 102, des: "玩家撤销退款" },
                { id: 104, des: "玩家超时自动撤销退款" },
                { id: 201, des: "达人拒绝退款" },
                { id: 202, des: "达人同意退款" },
                { id: 203, des: "达人超时自动同意退款" },
                { id: 301, des: "客服同意退款" },
                { id: 302, des: "客服撤销退款" }
            ];
          }
        }
        $scope.changeStatus();
        $scope.selected=4;
        $scope.change_sel=function(selected){
            $scope.selected=selected;
            $scope.getList($scope.tableState);
        }
        $scope.removeContent=function(){
            $scope.smartTable.start='';
            $scope.smartTable.end='';
            $scope.smartTable.searchContent = '';
            $scope.getList($scope.tableState);
        }

        // 分页获取数据
        $scope.getList = function(tableState) {
            var pagination = tableState.pagination; //tableState为插件暴露属性
            $scope.tableState = tableState; //设置table外部搜索请求参数
            var start = pagination.start || 0; // 获取翻页开始行
            var number = pagination.number || 10; // 获取每页显示行数

            $scope.pageIndex = start / $scope.smartTable.pageSize + 1; //获取当前页面
            if (($scope.smartTable.start!="")||($scope.smartTable.end!="")) {
                if (($scope.smartTable.start!="")||($scope.smartTable.end!="")) {
                    var resVerify=baUtil.verifyTime($scope.smartTable.start,$scope.smartTable.end);
                    if(typeof resVerify!=='undefined'){
                        toastr.error(resVerify, '');
                        return ;
                    }
                }
            }

            $scope.isLoading = true; //默认为读取数据状态中

            var params ;
            if (!$scope.smartTable.searchContent) {
                params = {
                    page: $scope.pageIndex, //动态获取翻页页面index
                    size: $scope.smartTable.pageSize,
                    key:"",
                    result:$scope.selected
                };
            } else {
                params = {
                    page: $scope.pageIndex, //动态获取翻页页面index
                    size: $scope.smartTable.pageSize,
                    key: $scope.smartTable.searchContent,
                    result:$scope.selected
                };

                //监听搜索内容改变
                var watchSearchContent = $scope.$watch('smartTable.searchContent', function(newValue, oldValue, scope) {
                    if (newValue != oldValue) {
                        tableState.pagination.start = 0; //初始化从第一页显示
                    }
                });
            }
            if($scope.smartTable.start!=""){
                params.startTime=$scope.smartTable.start+" "+"00:00";
            }
            if($scope.smartTable.end!=""){
                params.endTime=$scope.smartTable.end+" "+"00:00";
            }
            if($scope.selected==4){
              delete params.result;
            }
            apiRequest.post($scope.cancelStatus==0?'/admin/order/refund/refund-not-apply':'/admin/order/refund/refund-service', params, function(res) {
                $scope.tableData = res.data.list;
                $scope.datasTotalNum = res.data.total;
                tableState.pagination.numberOfPages = $scope.datasTotalNum % number == 0 ? parseInt($scope.datasTotalNum / number) : (parseInt($scope.datasTotalNum / number) + 1); //获取可翻页总页数
                $scope.isLoading = false; //服务器返回数据后显示
                $scope.itemFrom = start + 1; //页面显示行开始
                $scope.itemTo = (start + number) > $scope.datasTotalNum ? $scope.datasTotalNum : (start + number); //页面显示行结束
            });
        };


        $scope.resultStatus=function(index){
            if(index==1){
                return '同意退款';
            }
            if(index==2){
                return '已撤销';
            }
            if(index==0){
                return '未处理';
            }
            else{
              return "--";
            }
        }

        $scope.notApplyStatus=function(status,serviceResult){
          var flag=0;
          if(status!=145 && status!=146 && status!=147 && status!=700 && serviceResult==0){
          	flag=1;
          }else{
            //查看
          	flag=0;
          }
          if(status==145 || status==146 || status==147 || status==700 || serviceResult!=0){
          	flag=0;
          }else{
          	flag=1;
          }
          return flag;
        }

        $scope.statusText=function(index){
          if($scope.cancelStatus==0){
            //未申请介入
            switch(index){
              case 101:return '未处理';break;
              case 102:return '玩家撤销退款';break;
              case 104:return '玩家超时自动撤销退款';break;
              case 201:return '达人拒绝退款';break;
              case 202:return '达人同意退款';break;
              case 203:return '达人超时自动同意退款';break;
              case 301:return '客服同意退款';break;
              case 302:return '客服撤销退款';break;
              default:return "--";
            }
          }
          //申请客服介入
          if($scope.cancelStatus==1){
            switch(index){
              case 0:return '待处理';break;
              case 1:return '客服同意退款';break;
              case 2:return '客服撤销退款';break;
              default:return "--";
            }
          }

        }

        $scope.cancelDetail=function(id,index){
          $scope.modal = {
            index:index,
              params: {
                  id:id,
              }
          };
          modalsService.normal('app/pages/business/cancelorder/cancelorderdetail.html','canceldetailCtrl',$scope.modal,function(){});
        }

        $scope.toggle=function(index){
          $scope.cancelStatus=index;
          $scope.changeStatus();
          $scope.selected=4;
          $timeout(function() {
              for (var i = 0; i < angular.element("body").find("option:selected").length; i++) {
                  if (angular.element("body").find("option:selected")[i].label == '') {
                      angular.element("body").find("option:selected")[i].remove('option');
                  }
              }
          }, 50);
          $scope.getList ($scope.tableState);
        }
    }

})();
