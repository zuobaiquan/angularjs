(function() {
    'use strict';


    angular.module('BlurAdmin.pages.system')
        .controller('roleCtrl', roleCtrl);

    /** @ngInject */
    function roleCtrl($scope,apiRequest,modalsService) {
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

            var params ;
            if (!$scope.smartTable.searchContent) {
                params = {
                    page: $scope.pageIndex, //动态获取翻页页面index
                    size: $scope.smartTable.pageSize,
                    key:""
                };
            } else {
                params = {
                    page: $scope.pageIndex, //动态获取翻页页面index
                    size: $scope.smartTable.pageSize,
                    key: $scope.smartTable.searchContent
                };

                //监听搜索内容改变
                var watchSearchContent = $scope.$watch('smartTable.searchContent', function(newValue, oldValue, scope) {
                    console.log('watch')
                    // console.log('contentchange', newValue, oldValue);
                    if (newValue != oldValue) {
                        tableState.pagination.start = 0; //初始化从第一页显示
                    }
                });
            }

            apiRequest.post('/admin/Role/roleList', params, function(res) {
                $scope.tableData = res.data.list;
                $scope.datasTotalNum = res.data.total;
                tableState.pagination.numberOfPages = $scope.datasTotalNum % number == 0 ? parseInt($scope.datasTotalNum / number) : (parseInt($scope.datasTotalNum / number) + 1); //获取可翻页总页数
                $scope.isLoading = false; //服务器返回数据后显示
                $scope.itemFrom = start + 1; //页面显示行开始
                $scope.itemTo = (start + number) > $scope.datasTotalNum ? $scope.datasTotalNum : (start + number); //页面显示行结束
            });
        };

        $scope.del = function(row) {
            $scope.modal = {
                url: "/admin/Role/update-status-role",
                title: "确认信息",
                success: "账号信息删除成功",
                message: "您确定要删除您选中的角色吗？",
                params: {
                    roleId: row.id
                }
            };
            modalsService.callback($scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        };

        $scope.add = function() {
            $scope.modal = {
                url: "/admin/Role/add-role",
                title: "添加账号",
                success: "添加账号成功",
                params: {
                    name:'',
                    description:''
                }
            };
            modalsService.normal('app/pages/system/role/editinfo.html','ModalCtrl',$scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        };

        $scope.editPower = function(item){
            $scope.modal = {
                url: "/admin/Role/update-roleMenu",
                title: "修改角色和权限信息",
                success: "修改成功",
                roleId:item.id,
                params:{
                  name:item.name,
                  description:item.description
                },
                config:{
                    core: {
                        multiple: true,
                        check_callback: true,
                        worker: true,
                        force_text:[7,8,9]
                    },
                    'types': {
                        'folder': {
                            'icon': 'ion-ios-folder'
                        },
                        'default': {
                            'icon': 'ion-document-text'
                        }
                    },
                    'plugins': ['types','checkbox'],
                    'version':1
                }
            };


            apiRequest.post('/admin/Role/load-roleMenu',{roleId:item.id},function(res){
                var ids = res.data.MenuOfRole;
                for(var i=0,l=res.data.AllMenu.length;i<l;i++){
                    res.data.AllMenu[i].text = res.data.AllMenu[i].title;
                    res.data.AllMenu[i].state ={
                        "opened": true,
                        "selected":false
                    };
                    if(ids.indexOf(res.data.AllMenu[i].id)!=-1){
                        if(res.data.AllMenu[i].father!=0){
                            res.data.AllMenu[i].state.selected = true;
                        }
                    }
                    res.data.AllMenu[i].id += '';
                    if(res.data.AllMenu[i].father == 0){
                        res.data.AllMenu[i].parent =  '#';
                        res.data.AllMenu[i].type = 'folder';
                    }else{
                        res.data.AllMenu[i].parent = res.data.AllMenu[i].father;
                        res.data.AllMenu[i].type = 'default';
                    }
                    delete res.data.AllMenu[i].father;
                }
                $scope.modal.data = res.data.AllMenu;
                modalsService.normal('app/pages/system/role/reset_power.html','powerModalCtrl',$scope.modal,function(){});
            });
        }
    }

})();
