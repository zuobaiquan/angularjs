(function() {
    'use strict';
    angular.module('BlurAdmin.pages.datacenter')
        .controller('collectCtrl', collectCtrl);

    /** @ngInject */
    function collectCtrl($scope,apiRequest,$filter,$uibModal,toastr,baUtil) {
        var today = new Date();
		var daytomorrow = new Date();
		var daytomorrow=daytomorrow.setTime(daytomorrow.getTime()+24*60*60*1000);

        $scope.smartTable = {
            pageSize: 50,
            searchContent: '',
            start:$filter('date')(today, 'yyyy-MM-dd'),
            end:$filter('date')(new Date(daytomorrow), 'yyyy-MM-dd')
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
                    startTime:$scope.smartTable.start,
                    endTime:$scope.smartTable.end
                };
            } else {
                params = {
                    page: $scope.pageIndex, //动态获取翻页页面index
                    size: $scope.smartTable.pageSize,
                    key: $scope.smartTable.searchContent,
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
            apiRequest.get('/admin/collection/list', params, function(res) {
                $scope.tableData = res.data.list;
                $scope.datasTotalNum = res.data.total;
                tableState.pagination.numberOfPages = $scope.datasTotalNum % number == 0 ? parseInt($scope.datasTotalNum / number) : (parseInt($scope.datasTotalNum / number) + 1); //获取可翻页总页数
                $scope.isLoading = false; //服务器返回数据后显示
                $scope.itemFrom = start + 1; //页面显示行开始
                $scope.itemTo = (start + number) > $scope.datasTotalNum ? $scope.datasTotalNum : (start + number); //页面显示行结束
            });
        };
        $scope.collectDetail = function(id,start,end) {
          $scope.modal = {
               url: "/admin/collection/detail",
               params: {
                  id:id,start:start,end:end
               }
          };
          $uibModal.open({
              animation: true,
              templateUrl: 'app/pages/datacenter/collect/collectdetail.html',
              controller: 'collectdetailCtrl',
              size: 'md',
              resolve: {
                 modal: function() {
                    return $scope.modal;
                 }
              }
           }).result.then(function(result) {
              if (result == "success") {
                 $scope.getList($scope.tableState);
              }
           });
        };

    }

})();
