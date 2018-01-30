(function() {
    'use strict';
    angular.module('BlurAdmin.pages.marketing')
        .controller('marktasteCtrl', marktasteCtrl);

    function marktasteCtrl($scope,apiRequest,modalsService) {
        $scope.smartTable = {
            pageSize: 10,
            searchContent: ''
        }; //设置每页默认条数

        // 分页获取数据
        $scope.getList = function(tableState) {
            var pagination = tableState.pagination; //tableState为插件暴露属性
            $scope.tableState = tableState; //设置table外部搜索请求参数
            var start = pagination.start || 0; // 获取翻页开始行
            var number = pagination.number || 10; // 获取每页显示行数

            $scope.pageIndex = start / $scope.smartTable.pageSize + 1; //获取当前页面

            $scope.isLoading = true; //默认为读取数据状态中

            var params  = {
                page: $scope.pageIndex, //动态获取翻页页面index
                size: $scope.smartTable.pageSize,
            };

            // var params;
            // if (!$scope.smartTable.searchContent) {
            //     params = {
            //         page: $scope.pageIndex, //动态获取翻页页面index
            //         size: $scope.smartTable.pageSize,
            //         key:""
            //     };
            // } else {
            //     params = {
            //         page: $scope.pageIndex, //动态获取翻页页面index
            //         size: $scope.smartTable.pageSize,
            //         key: $scope.smartTable.searchContent
            //     };
            //
            //     //监听搜索内容改变
            //     var watchSearchContent = $scope.$watch('smartTable.searchContent', function(newValue, oldValue, scope) {
            //         console.log('watch')
            //         // console.log('contentchange', newValue, oldValue);
            //         if (newValue != oldValue) {
            //             tableState.pagination.start = 0; //初始化从第一页显示
            //         }
            //     });
            // }
            apiRequest.post('/admin/newest/newest-list', params, function(res) {
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
                url: "/admin/newest/edit-status",
                title: "确认信息",
                success: "删除成功",
                message: "您确定删除您选中的项吗？",
                params: {
                    id: id
                }
            };
            modalsService.callback($scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        };

        $scope.add = function() {
            $scope.modal = {
                url: "/admin/newest/add-newest",
                title: "新建最新体验",
                success: "添加成功",
                op:'add',
            };
            modalsService.normal('app/pages/marketing/taste/editinfo.html','mktasteeditCtrl',$scope.modal,function(){});
        };

        $scope.editNewest = function(item){
            $scope.modal = {
                url: "/admin/newest/edit-newest",
                title: "编辑最新体验",
                success: "修改成功",
                op:'edit',
                data:item
            };
            modalsService.normal('app/pages/marketing/taste/editinfo.html','mktasteeditCtrl',$scope.modal,function(){});
        }

        $scope.tasteDetail=function(item) {
          $scope.modal = {
              params:item
          };
          modalsService.normal('app/pages/marketing/taste/tastedetail.html','mktasteeditCtrl',$scope.modal,function(){});
        }
    }

})();
