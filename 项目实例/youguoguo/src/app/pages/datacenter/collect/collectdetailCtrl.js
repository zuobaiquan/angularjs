(function() {
    'use strict';
    angular.module('BlurAdmin.pages.datacenter')
        .controller('collectdetailCtrl', collectdetailCtrl);

    /** @ngInject */
    function collectdetailCtrl($scope,modal,apiRequest,toastr,baUtil) {
        $scope.smartTable = {
            pageSize: 5,
            start:modal.params.start,
            end:modal.params.end,
        }; //设置每页默认条数

        $scope.removeContent=function(){
            $scope.smartTable.start='';
            $scope.smartTable.end='';
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
            var params = {
                page: $scope.pageIndex, //动态获取翻页页面index
                size: $scope.smartTable.pageSize,
                id:modal.params.id,
                startTime:$scope.smartTable.start,
                endTime:$scope.smartTable.end
            };
            apiRequest.post('/admin/collection/detail', params, function(res) {
                $scope.tableData = res.data.list;
                $scope.datasTotalNum = res.data.total;
                tableState.pagination.numberOfPages = $scope.datasTotalNum % number == 0 ? parseInt($scope.datasTotalNum / number) : (parseInt($scope.datasTotalNum / number) + 1); //获取可翻页总页数
                $scope.isLoading = false; //服务器返回数据后显示
                $scope.itemFrom = start + 1; //页面显示行开始
                $scope.itemTo = (start + number) > $scope.datasTotalNum ? $scope.datasTotalNum : (start + number); //页面显示行结束
            });
        };
    }

})();
