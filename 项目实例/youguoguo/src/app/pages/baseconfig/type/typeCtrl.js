(function() {
    'use strict';


    angular.module('BlurAdmin.pages.baseconfig')
        .controller('typeCtrl', typeCtrl);

    function typeCtrl($scope,adminService,apiRequest,modalsService,IMAGE_UPLOAD) {
      var vm = this;
      vm.init = init;
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

            apiRequest.post('/admin/base/load-type', params, function(res) {
                $scope.tableData = res.data.list;
                $scope.datasTotalNum = res.data.total;
                tableState.pagination.numberOfPages = $scope.datasTotalNum % number == 0 ? parseInt($scope.datasTotalNum / number) : (parseInt($scope.datasTotalNum / number) + 1); //获取可翻页总页数
                $scope.isLoading = false; //服务器返回数据后显示
                $scope.itemFrom = start + 1; //页面显示行开始
                $scope.itemTo = (start + number) > $scope.datasTotalNum ? $scope.datasTotalNum : (start + number); //页面显示行结束
            });
        };

        $scope.add = function() {
            $scope.modal = {
                url: "/admin/base/add-type",
                title: "新建类别",
                success: "添加成功",
                params: {
                    name:'',
                    sort:0,
                    icon:'',
                    remark:'',
                    adminId:adminService.getAdmin().admin.id
                }
            };
            modalsService.normal('app/pages/baseconfig/type/editinfo.html','ModalCtrl',$scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        };

        $scope.magnificateImg=function(item) {
            $.magnificPopup.open({
                items: {
                    src: item.icon
                },
                type: "image",
                mainClass: "mfp-fade"
            });
        }

        $scope.editInfo = function(item){
            $scope.modal = {
                url: "/admin/base/edit-type",
                title: "修改类别信息",
                success: "修改成功",
                params: {
                    id: item.id,
                    name:item.name,
                    icon:item.icon,
                    remark:item.remark,
                    sort:item.sort
                }
            };
            modalsService.normal('app/pages/baseconfig/type/editinfo.html','ModalCtrl',$scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }

        $scope.delType=function(id){
            $scope.modal = {
                url: "/admin/base/update-status",
                title: "确认信息",
                success: "该类别删除成功",
                message: "您确定要删除该类别吗？",
                params: {
                    id: id,
                }
            };
            modalsService.callback($scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }
        function init() {
            vm.token = IMAGE_UPLOAD.token;
            vm.link = IMAGE_UPLOAD.link;
        }
        vm.key = {
            value: null
        };
    }
})();
