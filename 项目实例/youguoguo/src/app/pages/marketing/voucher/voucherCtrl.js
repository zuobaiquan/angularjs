(function() {
    'use strict';
    angular.module('BlurAdmin.pages.marketing')
        .controller('voucherCtrl', voucherCtrl);

    function voucherCtrl($scope, $state,apiRequest,modalsService,toastr,baUtil) {
        $scope.companyType =[
            { id: 2, des: "全部" },
            { id: 0, des: "进行中" },
            { id: 1, des: "已过期" }
        ];
        $scope.selected=2;
        $scope.change_sel=function(selected){
            $scope.selected=selected;
            $scope.getList($scope.tableState);
        }
        $scope.smartTable = {
            pageSize: 5,
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

        // 分页获取数据
        $scope.getList = function(tableState) {
            var pagination = tableState.pagination; //tableState为插件暴露属性
            $scope.tableState = tableState; //设置table外部搜索请求参数
            var start = pagination.start || 0; // 获取翻页开始行
            var number = pagination.number || 10; // 获取每页显示行数

            $scope.pageIndex = start / $scope.smartTable.pageSize + 1; //获取当前页面
            if (($scope.smartTable.start!="")||($scope.smartTable.end!="")) {
                var resVerify=baUtil.verifyTime($scope.smartTable.start,$scope.smartTable.end);
                if(typeof resVerify!=='undefined'){
                    toastr.error(resVerify, '');
                    return ;
                }
            }
            $scope.isLoading = true; //默认为读取数据状态中

            var params ;
            if (!$scope.smartTable.searchContent) {
                params = {
                    page: $scope.pageIndex, //动态获取翻页页面index
                    size: $scope.smartTable.pageSize,
                    key:"",
                    status:$scope.selected,
                    startTime:$scope.smartTable.start,
                    endTime:$scope.smartTable.end
                };
            } else {
                params = {
                    page: $scope.pageIndex, //动态获取翻页页面index
                    size: $scope.smartTable.pageSize,
                    key: $scope.smartTable.searchContent,
                    status:$scope.selected,
                    startTime:$scope.smartTable.start,
                    endTime:$scope.smartTable.end
                };

                //监听搜索内容改变
                var watchSearchContent = $scope.$watch('smartTable.searchContent', function(newValue, oldValue, scope) {
                    if (newValue != oldValue) {
                        tableState.pagination.start = 0; //初始化从第一页显示
                    }
                });
            }
            if($scope.selected==2){
              delete params.status;
            }
            apiRequest.get('/admin/coupon/list', params, function(res) {
                $scope.tableData = res.data.list;
                $scope.datasTotalNum = res.data.total;
                tableState.pagination.numberOfPages = $scope.datasTotalNum % number == 0 ? parseInt($scope.datasTotalNum / number) : (parseInt($scope.datasTotalNum / number) + 1); //获取可翻页总页数
                $scope.isLoading = false; //服务器返回数据后显示
                $scope.itemFrom = start + 1; //页面显示行开始
                $scope.itemTo = (start + number) > $scope.datasTotalNum ? $scope.datasTotalNum : (start + number); //页面显示行结束
            });
        };

        $scope.addVoucher=function(){
          $scope.modal = {
                url: "/admin/coupon/add",
                title: "创建代金券",
                success: "添加成功",
                params: {
                    name:'',
                    price:'',
                    startTime:'',
                    endTime:'',
                    issueAmount:null,
                    getCount:null,
                    consumeLimit:null,
                    getWays:0,
                    useRange:0,
                    remark:""
                }
            };
            modalsService.normal('app/pages/marketing/voucher/addvoucher.html','vouchereditCtrl',$scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }

        $scope.stopCoupon=function(id){
            apiRequest.post('/admin/coupon/stop', { id:id }, function (res) {
                if (res.code == "200") {
                    toastr.success('已设置为置顶');
                    $state.reload();
                } else {
                    toastr.error(res.message, '');
                    $scope.$apply();
                }
            },function(err){
                toastr.error(err.message, '');
                return ;
            });
        }

        $scope.statusText=function(id){
            if(id==0){
                return "待审核";
            }
            if(id==1){
                return "驳回";
            }
            if(id==2){
                return "已通过";
            }
            if(id==3){
                return "已删除";
            }
        }

        $scope.stopCoupon=function(id){
          $scope.modal = {
              url: "/admin/coupon/stop",
              success: "已停止发行",
              params: {
                  id: id,
              }
          };
          modalsService.normal('app/pages/modal/confirm2.html','ModalCtrl',$scope.modal,function(){
              $scope.getList($scope.tableState);
          });
        }

        $scope.voucherDetail=function(item){
            $scope.modal = {
                params:item
            };
            modalsService.normal('app/pages/marketing/voucher/voucherdetail.html','vouchereditCtrl',$scope.modal,function(){});
        }

    }

})();
