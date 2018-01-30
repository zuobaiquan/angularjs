(function() {
    'use strict';
    angular.module('BlurAdmin.pages.service')
        .controller('orderCtrl', orderCtrl);

    function orderCtrl($scope,apiRequest,$state,modalsService,toastr,adminService) {
        $scope.smartTable = {
            pageSize: 10,
            searchContent: '',
            start:"",
            end:"",
        }; //设置每页默认条数

        $scope.removeContent=function(){
            $scope.smartTable.start='';
            $scope.smartTable.end='';
            $scope.smartTable.searchContent = '';
            $scope.getList($scope.tableState);
        }

        $scope.selected=1;
        $scope.readyreceive=true;
        $scope.changetab=function(id){
            $scope.isclicktab=true;
            $scope.selected=id;
            if(id!=1){
                $scope.readyreceive=false;
            }
            else{
                $scope.readyreceive=true;
            }
            $scope.getList($scope.tableState);
        }

        // 分页获取数据
        $scope.getList = function(tableState) {
            angular.element("body").find(".tab-content").css({"padding":"0"});
            var pagination = tableState.pagination; //tableState为插件暴露属性
            $scope.tableState = tableState; //设置table外部搜索请求参数
            var start = pagination.start || 0; // 获取翻页开始行
            var number = pagination.number || 10; // 获取每页显示行数

            $scope.pageIndex = start / $scope.smartTable.pageSize + 1; //获取当前页面
            if (($scope.smartTable.start!="")||($scope.smartTable.end!="")) {
                var arrStart = $scope.smartTable.start.split("-");
                var arrEnd = $scope.smartTable.end.split("-");
                if (parseInt(arrEnd[0]) < parseInt(arrStart[0])) {
                    toastr.error("结束日期不能小于开始日期", '');
                    return;
                }
                if (parseInt(arrEnd[0]) >= parseInt(arrStart[0])) {
                  if ((parseInt(arrEnd[1]) - parseInt(arrStart[1])) < 0) {
                    if (parseInt(arrEnd[0]) == parseInt(arrStart[0])) {
                      if ((parseInt(arrEnd[1]) - parseInt(arrStart[1])) < 0) {
                        toastr.error("结束日期不能小于开始日期", '');
                        return;
                      }
                    }
                  }
                }
                if (parseInt(arrEnd[0]) >= parseInt(arrStart[0])) {
                    if ((parseInt(arrEnd[1]) - parseInt(arrStart[1])) == 0) {
                        if ((parseInt(arrEnd[2]) - parseInt(arrStart[2])) < 0) {
                            toastr.error("结束日期不能小于开始日期", '');
                            return;
                        }
                    }
                }
            }

            $scope.isLoading = true; //默认为读取数据状态中

            var params ;
            if (!$scope.smartTable.searchContent) {
                params = {
                    accountId:adminService.getAdmin().account.id,
                    page: $scope.pageIndex, //动态获取翻页页面index
                    size: $scope.smartTable.pageSize,
                    key:"",
                    receivingTate:$scope.selected
                };
            } else {
                params = {
                    accountId:adminService.getAdmin().account.id,
                    page: $scope.pageIndex, //动态获取翻页页面index
                    size: $scope.smartTable.pageSize,
                    key: $scope.smartTable.searchContent,
                    receivingTate:$scope.selected
                };

                //监听搜索内容改变
                var watchSearchContent = $scope.$watch('smartTable.searchContent', function(newValue, oldValue, scope) {
                    if (newValue != oldValue) {
                        tableState.pagination.start = 0; //初始化从第一页显示
                    }
                });
            }
            if($scope.smartTable.start!=""){
                params.startTime=$scope.smartTable.start+" "+"00:00:00";
            }
            if($scope.smartTable.end!=""){
                params.endTime=$scope.smartTable.end+" "+"00:00:00";
            }
            if($scope.isclicktab){
                params.page=1;
            }
            apiRequest.post('/shopAdmin/order/orderList', params, function(res) {
                $scope.tableData = res.data.list;
                $scope.datasTotalNum = res.data.total;
                tableState.pagination.numberOfPages = $scope.datasTotalNum % number == 0 ? parseInt($scope.datasTotalNum / number) : (parseInt($scope.datasTotalNum / number) + 1); //获取可翻页总页数
                $scope.isLoading = false; //服务器返回数据后显示
                $scope.itemFrom = start + 1; //页面显示行开始
                if($scope.isclicktab){
                    $scope.itemFrom=1;
                }
                $scope.itemTo = (start + number) > $scope.datasTotalNum ? $scope.datasTotalNum : (start + number); //页面显示行结束
                $scope.isclicktab=false;
            });
        };

        $scope.setRevicing=function(id){
            $scope.modal = {
                url: "/shopAdmin/order/sureServe",
                title: "确认信息",
                success: "接待成功",
                message: "您确定要接待您选中的项吗？",
                params: {
                    orderId: id
                }
            };
            modalsService.callback($scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }

        $scope.persons=[];
        $scope.receiveAll=function(tableData){
            var delid="";
            for(var item in $scope.persons){
                if($scope.persons[item].state==true){
                    delid+=item+",";
                }
            }
            delid=delid.substring(0,delid.length-1);
            if(delid.length==0){
                toastr.error("请选择接待项", '');
                return;
            }
            $scope.modal = {
                title: "确认信息",
                success: "接待成功",
                message: "您确定要批量接待您选中的项吗？",
                url:'/shopAdmin/order/sureServe',
                params: {
                    orderId:delid
                }
            };
            modalsService.callback($scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }

        $scope.statusText=function(status){
            //0待支付1已支付2已取消 3退款中5退款成功4待评论6已售罄7已结束
            if(status==120){
               return "退款中";
            }
            if(status==130){
               return "已退款";
            }
            else{
                return "--";
            }
        }

        $scope.refuseRevicing=function(id){
          $scope.modal = {
              url: "/shopAdmin/order/cancel",
              title: "拒绝理由",
              success: "拒绝理由已填写",
              params: {
                  orderId: id,
                  reason:''
              }
          };
          modalsService.normal('app/pages/service/order/addreason.html','addreasonCtrl',$scope.modal,function(){
              $state.reload();
          });
      }
    }


})();
