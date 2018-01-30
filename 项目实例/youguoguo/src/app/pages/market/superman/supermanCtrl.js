(function() {
    'use strict';
    angular.module('BlurAdmin.pages.market')
        .controller('supermanCtrl', supermanCtrl);

    function supermanCtrl($scope,apiRequest,toastr,adminService,baUtil,modalsService) {
        $scope.companyType =[
            { id: 4, des: "全部" },
            { id: 0, des: "待审核" },
            { id: 1, des: "驳回" },
            { id: 2, des: "已通过" },
            { id: 3, des: "已删除" }
        ];
        $scope.selected=4;
        $scope.change_sel=function(selected){
            $scope.selected=selected;
            $scope.getList($scope.tableState);
        }
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
                    status:$scope.selected
                };
            } else {
                params = {
                    page: $scope.pageIndex, //动态获取翻页页面index
                    size: $scope.smartTable.pageSize,
                    key: $scope.smartTable.searchContent,
                    status:$scope.selected
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
            if($scope.selected==4){
                delete params.status;
            }
            else{
                params.status=$scope.selected;
            }
            if($scope.smartTable.start!=""){
                params.startTime=$scope.smartTable.start+" "+"00:00:00";
            }
            if($scope.smartTable.end!=""){
                params.endTime=$scope.smartTable.end+" "+"00:00:00";
            }
            apiRequest.post('/admin/expertPerson/expertList', params, function(res) {
                $scope.tableData = res.data.list;
                $scope.datasTotalNum = res.data.total;
                tableState.pagination.numberOfPages = $scope.datasTotalNum % number == 0 ? parseInt($scope.datasTotalNum / number) : (parseInt($scope.datasTotalNum / number) + 1); //获取可翻页总页数
                $scope.isLoading = false; //服务器返回数据后显示
                $scope.itemFrom = start + 1; //页面显示行开始
                $scope.itemTo = (start + number) > $scope.datasTotalNum ? $scope.datasTotalNum : (start + number); //页面显示行结束
            });
        };

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

        $scope.addsuperman=function(){
            $scope.modal = {
                url: "/admin/expertPerson/addExPertPerson",
                title: "果果达人认证",
                success: "添加成功",
                params: {
                    adminId:adminService.getAdmin().admin.id,
                    realName:'',
                    phone:0,
                    approvePhoto:'',
                    rangeServiceList:[{
                        id:0,
                        typeName:'',
                    }],
                    remark:'',
                    identifyCard:'',
                    shopIntroduce:'',
                    shopName:'',
                    status:2
                }
            };
            modalsService.normal('app/pages/market/superman/addsuperman.html','addStoreCtrl',$scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }

        $scope.delsuperman=function(id,status){
            if(status==3){
                $scope.modal = {
                    url: "/admin/shop/restore",
                    title: "确认信息",
                    success: "该店家已恢复认证",
                    message: "您确定要恢复认证该店家吗？",
                    params: {
                        shopId: id,
                    }
                };
            }
            else{
                $scope.modal = {
                    url: "/admin/shop/deleteShop",
                    title: "确认信息",
                    success: "该店家删除成功",
                    message: "您确定要删除该店家吗？",
                    params: {
                        shopId: id,
                    }
                };
            }
            modalsService.callback($scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }

        $scope.superDetail=function(item){
            $scope.modal = {
                //url: "/admin/shop/addShop",
                title: "果果达人审核",
                //success: "添加成功",
                params: {
                    id:item.id,
                    adminId:0,
                    status:item.status,
                    realName:item.realName,
                    phone:item.phone,
                    approvePhoto:item.approvePhoto,
                    rangeServiceList:item.rangeServiceList,
                    personIntro:item.personIntro,
                    identifyCard:item.identifyCard,
                    rangeServiceId:item.rangeServiceId,
                    applyTime:item.applyTime
                }
            };
            modalsService.normal('app/pages/market/store/storedetail.html','addsuperCtrl',$scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }
    }

})();
