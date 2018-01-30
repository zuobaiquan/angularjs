(function() {
    'use strict';
    angular.module('BlurAdmin.pages.system')
        .controller('sectionCtrl', sectionCtrl);
    function sectionCtrl($scope,apiRequest,modalsService) {
        $scope.smartTable = {
            pageSize: 10
        }; //设置每页默认条数
        // 分页获取数据
        $scope.getList = function(tableState) {
            var pagination = tableState.pagination; //tableState为插件暴露属性
            $scope.tableState = tableState; //设置table外部搜索请求参数
            var start = pagination.start || 0; // 获取翻页开始行
            var number = pagination.number || 10; // 获取每页显示行数

            $scope.pageIndex = start / $scope.smartTable.pageSize + 1; //获取当前页面

            $scope.isLoading = true; //默认为读取数据状态中

            var params = {
                page: $scope.pageIndex, //动态获取翻页页面index
                size: $scope.smartTable.pageSize
            };
            apiRequest.post('/admin/dept/deptList', params, function(res) {
                $scope.tableData = res.data.list;
                $scope.datasTotalNum = res.data.total;
                tableState.pagination.numberOfPages = $scope.datasTotalNum % number == 0 ? parseInt($scope.datasTotalNum / number) : (parseInt($scope.datasTotalNum / number) + 1); //获取可翻页总页数
                $scope.isLoading = false; //服务器返回数据后显示
                $scope.itemFrom = start + 1; //页面显示行开始
                $scope.itemTo = (start + number) > $scope.datasTotalNum ? $scope.datasTotalNum : (start + number); //页面显示行结束
            });
        };


        $scope.del = function(id) {
            $scope.modal = {
                url: "/admin/dept/update-status-dept",
                title: "确认信息",
                success: "部门删除成功",
                message: "您确定要删除您选中的部门吗？",
                params: {
                    deptId: id
                }
            };
            modalsService.callback($scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        };


        $scope.add = function() {
            $scope.modal = {
                url: "/admin/dept/add-dept",
                title: "添加部门",
                success: "添加部门成功",
                params: {
                    deptName:''
                }
            };
            modalsService.normal('app/pages/system/section/editinfo.html','ModalCtrl',$scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        };

        $scope.editSectionInfo = function(item){
            $scope.modal = {
                url: "/admin/dept/update-dept",
                title: "修改部门信息",
                success: "修改成功",
                params: {
                    deptId: item.id,
                    deptName:item.name
                }
            };
            modalsService.normal('app/pages/system/section/editinfo.html','ModalCtrl',$scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }
    }

})();
