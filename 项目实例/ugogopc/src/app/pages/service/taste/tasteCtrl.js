(function() {
    'use strict';
    angular.module('BlurAdmin.pages.service')
        .controller('tasteCtrl', tasteCtrl);

    /** @ngInject */
    function tasteCtrl($scope,apiRequest,$uibModal,$state,adminService,$filter,modalsService,toastr) {
        $scope.ugogoStatus =[
            { id: 3, des: "全部" },
            { id: 0, des: "待审核" },
            { id: 1, des: "驳回" },
            { id: 2, des: "已通过" }
        ];
        $scope.selstatus=3;
        $scope.change_selstatus=function(selstatus){
            $scope.selstatus=selstatus;
            $scope.getList($scope.tableState);
        }

        $scope.getAlltypelist=function(){
          $scope.ugogoType=[{ id: 0, des: "全部" }];
          apiRequest.post('/shopAdmin/Project/type-list', {}, function(res) {
              for(var item in res.data){
                $scope.ugogoType.push({
                  id:res.data[item].id,
                  des:res.data[item].name
                });
              }
          })
        }
        $scope.seltype=0;
        $scope.change_seltype=function(seltype){
            $scope.seltype=seltype;
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
                    key:""
                };
            } else {
                params = {
                    accountId:adminService.getAdmin().account.id,
                    page: $scope.pageIndex, //动态获取翻页页面index
                    size: $scope.smartTable.pageSize,
                    key: $scope.smartTable.searchContent
                };

                //监听搜索内容改变
                var watchSearchContent = $scope.$watch('smartTable.searchContent', function(newValue, oldValue, scope) {
                    if (newValue != oldValue) {
                        tableState.pagination.start = 0; //初始化从第一页显示
                    }
                });
            }
            if($scope.selstatus==3){
                delete params.status;
            }
            else{
                params.status=$scope.selstatus;
            }
            if($scope.seltype==0){
                delete params.seltype;
            }
            else{
                params.typeId=$scope.seltype;
            }
            if($scope.smartTable.start!=""){
                params.startTime=$scope.smartTable.start+" "+"00:00:00";
            }
            if($scope.smartTable.end!=""){
                params.endTime=$scope.smartTable.end+" "+"00:00:00";
            }
            apiRequest.post('/shopAdmin/Project/projectList', params, function(res) {
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
            else{
                return "--";
            }
        }
        $scope.reserveDatedetail=function(reserve_date){
            var reserveDate=[];
            angular.forEach(reserve_date,function(item, index){
               reserveDate.push(item.reserveDate);
            })
            $scope.modal={
              reserveDate:reserveDate
            }
            modalsService.normal('app/pages/service/taste/timedetail.html','reservelistCtrl',$scope.modal,function(){});
        }

        $scope.reserveTime=function(type,item){
            if(type==1){
                // var str="";
                // for(var i in item){
                //     str+=$filter('date')(item[i].reserveDate,'yyyy-MM-dd')+'  ';
                // }
                return 1;
            }
            if(type==2){
                return  "全年无休";
            }
            if(type==3){
                return  "工作日";
            }
            if(type==4){
                return  "周末假期";
            }
        }

        $scope.persons=[];
        $scope.delAllsel=function(tableData){
            var delid=[];
            for(var item in $scope.persons){
                if($scope.persons[item].state==true){
                    delid.push(item);
                }
            }
            if(delid.length==0){
                toastr.error("请选择操作项", '');
                return;
            }
            for(var i=0;i<delid.length;i++){
                for(var j=0;j<tableData.length;j++){
                    if(delid[i]==tableData[j].id){
                        if(tableData[j].status==0){
                            toastr.error("不能操作待审核的信息", '');
                            return;
                        }
                    }
                }
            }
            $scope.modal = {
                title: "确认信息",
                success: "删除成功",
                message: "您确定要删除您选中的项吗？",
                url:'/shopAdmin/Project/deleteProject',
                params: {
                    projectId:delid
                }
            };
            modalsService.callback($scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }

        $scope.addProject=function(){
          apiRequest.post('/shopAdmin/Project/is-first-add', {accountId:adminService.getAdmin().account.id}, function(res) {
            if(!res.data){
              $state.go("service.taste-add", {}, { reload: true });
            }
            if(res.data){
              $uibModal.open({
                  animation: true,
                  templateUrl: 'app/pages/service/taste/useragree.html',
                  controller: function($scope,$uibModalInstance,$state){
                    $scope.submit=function(){
                       $uibModalInstance.close();
                       $state.go("service.taste-add", {}, { reload: true });
                    }
                  },
                  size: 'md'
              });
            }
          })
        }


        $scope.delTaste=function(id){
            $scope.modal = {
                url: "/shopAdmin/Project/deleteProject",
                title: "确认信息",
                success: "删除成功",
                message: "您确定要删除您选中的项吗？",
                params: {
                    projectId: id
                }
            };
            modalsService.callback($scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }

        $scope.setallTasteupdown=function(tableData,isup){
            var delid=[];
            for(var item in $scope.persons){
                if($scope.persons[item].state==true){
                    delid.push(item);
                }
            }
            if(delid.length==0){
                toastr.error("请选择操作项", '');
                return;
            }
            for(var i=0;i<delid.length;i++){
                for(var j=0;j<tableData.length;j++){
                    if(delid[i]==tableData[j].id){
                        if(tableData[j].status==0){
                            toastr.error("不能操作待审核的信息", '');
                            return;
                        }
                        if(tableData[j].status==1){
                            toastr.error("不能操作被驳回的信息", '');
                            return;
                        }
                    }
                }
            }
            if(isup==1){
                $scope.modal = {
                    url: "/shopAdmin/Project/projectOnself",
                    title: "确认信息",
                    success: "已设置为上架",
                    message: "您确定要上架您选中的项吗？",
                    params: {
                        projectId: delid
                    }
                };
            }
            if(isup==-1){
                $scope.modal = {
                    url: "/shopAdmin/Project/projectOffself",
                    title: "确认信息",
                    success: "已设置为下架",
                    message: "您确定要下架您选中的项吗？",
                    params: {
                        projectId: delid
                    }
                };
            }
            modalsService.callback($scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }

        $scope.setTasteupdown=function(id,isup){
            if(isup==1){
                $scope.modal = {
                    url: "/shopAdmin/Project/projectOnself",
                    title: "确认信息",
                    success: "已设置为上架",
                    message: "您确定要上架您选中的项吗？",
                    params: {
                        projectId: id
                    }
                };
            }
            if(isup==-1){
                $scope.modal = {
                    url: "/shopAdmin/Project/projectOffself",
                    title: "确认信息",
                    success: "已设置为下架",
                    message: "您确定要下架您选中的项吗？",
                    params: {
                        projectId: id
                    }
                };
            }
            modalsService.callback($scope.modal,function(){
                $scope.getList($scope.tableState);
            });
        }
    }
})();
