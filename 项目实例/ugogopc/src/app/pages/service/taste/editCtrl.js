
(function() {
    'use strict';
    angular.module('BlurAdmin.pages.service')
        .controller('editCtrl', editCtrl);
    function editCtrl($scope,$state,$http,$stateParams, $filter,$timeout, toastr,adminService, $uibModal,apiRequest,$window,QINIU_LINK,modalsService,baUtil) {
        var vm = this;
        vm.init = init;
        vm.progress=0;
        if($state.current.data.operate=='add'){
          $scope.operate='add';
          $scope.reserve_date="";
        }
        if($state.current.data.operate=='edit'){
          $scope.operate='edit';
          $scope.projectRequest={address2:''}
          $scope.ishasData=false;
          $scope.reserveDate={
            reserve_date:[]
          }
        }
        vm.res=false;
        $scope.clearOption=function(){
            modalsService.clearOption();
        }
        $scope.confirm = function(link) {
            $scope.modal = {
                link: link,
            }
            modalsService.normal('app/pages/modal/confirm.html','ModalCtrl',$scope.modal,function(){});
        };

        $scope.getInfo=function(){
            apiRequest.post('/shopAdmin/Project/loadProjectById', {projectId:$stateParams.id}, function(res) {
                if (res.code == "200") {
                    $scope.projectRequest=res.data;
                    $scope.ishasData=true;
                    $scope.hasTimeslot=true;
                    apiRequest.post('/shopAdmin/Project/loadSET', {accountId:adminService.getAdmin().account.id}, function(res) {
                        $scope.alladddatalist=res.data;
                        $scope.items=[{ischeck:false}];$scope.items.shift();
                        for(var i=0;i<$scope.alladddatalist.teacherIntroList.length;i++){
                          if($scope.projectRequest.teacherIntroId==$scope.alladddatalist.teacherIntroList[i].id){
                            $scope.items.push({ischeck:true});
                          }else{
                            $scope.items.push({ischeck:false});
                          }
                        }
                        if(res.data.hasOwnProperty("expertPerson")){
                            $scope.isexpOrshop=true;
                            $scope.exportcheck=true;
                        }
                        if(res.data.hasOwnProperty("shop")){
                            $scope.isexpOrshop=false;
                            $scope.shopcheck=true;
                        }
                        $scope.project={
                          projecttypeId:[]
                        };
                        var typeidArr=$scope.projectRequest.typeId.split(",");
                        for(var i=0;i<typeidArr.length;i++){
                          $scope.project.projecttypeId.push(parseInt(typeidArr[i]));
                        }
                    });
                    if($scope.projectRequest.maxNum==-1){
                        $scope.projectRequest.maxNum=null;
                    }
                    var durtime=$scope.projectRequest.duration.split(/[^0-9]/);
                    $scope.showarea=true;
                    $scope.selTimeDate.selhour=parseInt(durtime[0]);
                    $scope.selTimeDate.selsecond=parseInt(durtime[2]);
                    $scope.projectRequest.address2=res.data.address.split(",")[3];
                    $http.get('app/pages/service/taste/allprovinces.json').success(function (res) {
                        $scope.list = res;
                        for(var i=0;i<$scope.list.length;i++){
                            if($scope.list[i].name==$scope.selprovice){
                                $scope.selPchild=$scope.list[i].child;
                                for(var j=0;j<$scope.selPchild.length;j++){
                                    if($scope.selPchild[j].name==$scope.selcity){
                                        $scope.selArea=$scope.selPchild[j].child;
                                        break;
                                    }
                                }
                            }
                        }
                    });
                    $scope.selprovice=res.data.address.split(",")[0];
                    $scope.selcity=res.data.address.split(",")[1];
                    $scope.selarea=res.data.address.split(",")[2];

                    if($scope.projectRequest.type==1){
                        for(var l=0;l<$scope.projectRequest.projectDateList.length;l++){
                            var timeformate=$scope.projectRequest.projectDateList[l].reserveDate;
                            $scope.reserveDate.reserve_date.push(timeformate);
                        }
                    }
                    else{
                        $scope.projectRequest.projectDateList=[{
                            reserveDate: ''
                        }]
                    }
                    $scope.videoimgUrl=[{url:''}];
                    $scope.videoimgUrl.splice(0,1);
                    for(var i=0;i<res.data.url.length;i++){
                        $scope.videoimgUrl.push({
                            url:res.data.url[i]
                        });
                    }
                    $scope.projectNotice=[{notice:''}];
                    $scope.projectNotice.shift();
                    var noticeArr1=$scope.projectRequest.projectNotice.split(",");
                    for(var i=0;i<noticeArr1.length;i++){
                      $scope.projectNotice.push({
                        notice:noticeArr1[i].slice(2)
                      });
                    }
                    $scope.projectService=[{service:''}];
                    $scope.projectService.shift();
                    var serviceArr1=$scope.projectRequest.projectService.split(",");
                    for(var i=0;i<serviceArr1.length;i++){
                      $scope.projectService.push({
                        service:serviceArr1[i].slice(2)
                      });
                    }
                    for(var j=0;j<res.data.projectFlowList.length;j++){
                      $scope.projectRequest.projectFlowList[j].stepPhoto1=[];
                      for(var kk=0;kk<$scope.projectRequest.projectFlowList[j].stepPhotoList.length;kk++){
                        $scope.projectRequest.projectFlowList[j].stepPhoto1.push({
                          indexstepId:kk,
                          link:$scope.projectRequest.projectFlowList[j].stepPhotoList[kk]
                        });
                      }
                    }
                    $scope.time=[{startTime:'',endTime:''}];
                    $scope.time.shift();
                    var temptime='';
                    for(var kk=0;kk<$scope.projectRequest.projectTimeFrameList.length;kk++){
                        temptime=$scope.projectRequest.projectTimeFrameList[kk].timeFrame.split("-");
                        $scope.time.push({
                            startTime: temptime[0].substring(0,5),
                            endTime:temptime[1].substring(0,5)
                        })
                    }
                }else {
                    toastr.error(res.message, '');
                    $scope.$apply();
                }
            },function(res2){
                toastr.error(res2.data.message, '');
            });
        }

        $scope.$watch('project.projecttypeId', function (newValue, oldValue) {
            if(newValue!=oldValue){
                if(newValue.length>3){
                    toastr.error("体验类别最多选3项", '');
                    $scope.project.projecttypeId=oldValue;
                    return;
                }
            }
        },true);

        $scope.showStep1=true;
        $scope.showStep2=false;
        $scope.showStep3=false;
        //判断数字是否正确
        $scope.isNumber=function(str){
            var reg=/^[0-9]*$/;
            return reg.test(str);
        }
        $scope.isRightprice=function(str){
          var reg=/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
          return reg.test(str);
        }
        $scope.nextStep1=function(){
            if($scope.projectRequest.name==""||$scope.projectRequest.name==null){
                toastr.error("体验名称不能为空", '');
                return;
            }
            if($scope.project.projecttypeId.length==0){
                toastr.error("体验类别至少选择一项", '');
                return;
            }
            if($state.current.data.operate=='add'){
              if(typeof $scope.selprovice.name=="undefined"){
                  toastr.error("请选择省份", '');
                  return;
              }
              if(typeof $scope.selcity.name=="undefined"){
                  toastr.error("请选择城市", '');
                  return;
              }
              if($scope.selcity==null){
                  toastr.error("请选择城市", '');
                  return;
              }
            }
            if($scope.selcity.name=="请选择城市"){
                toastr.error("请选择城市", '');
                return;
            }
            if($state.current.data.operate=='edit'){
              if($scope.projectRequest.address2==null){
                  toastr.error("体验详细地址不能为空", '');
                  return;
              }
            }
            if($state.current.data.operate=='add'){
              if($scope.projectRequest.address==""){
                 toastr.error("体验详细地址不能为空", '');
                 return;
              }
              if($scope.projectRequest.type==0){
                  toastr.error("请选择可预订日期类型", '');
                  return;
              }
            }

            if($scope.projectRequest.type==1){
              if($scope.reserveDate.reserve_date.length==0){
                  toastr.error("预约日期至少添加一项", '');
                  return;
              }
            }
            if($scope.time.length==0){
                toastr.error("可预订时段至少添加一项", '');
                return;
            }
            if(($scope.projectRequest.maxNum!=="")&&($scope.projectRequest.maxNum!==null)){
              if(!$scope.isNumber($scope.projectRequest.maxNum)){
                  toastr.error('人数限制格式不正确', '', {});
                  return false;
              }
            }
            if(!$scope.isNumber($scope.projectRequest.dayTime)){
                toastr.error('预约天数格式不正确', '', {});
                return false;
            }
            if(!$scope.isNumber($scope.projectRequest.hourTime)){
                toastr.error('预约小时格式不正确', '', {});
                return false;
            }
            if(($scope.projectRequest.price==null)){
                toastr.error('体验价格输入不能为空', '', {});
                return false;
            }
            if(($scope.projectRequest.price=="")){
                toastr.error('体验价格输入不能为空', '', {});
                return false;
            }
            if($scope.projectRequest.price!=""){
              if(!$scope.isRightprice($scope.projectRequest.price)){
                  toastr.error('体验价格格式不正确', '', {});
                  return false;
              }
            }
            $window.scrollTo(0,0);
            $scope.showStep1=false;
            $scope.showStep2=true;
            $scope.showStep3=false;
        }
        $scope.nextStep2=function(){

            var flagvideoimg=false;
            for(var k in $scope.videoimgUrl){
               if($scope.videoimgUrl[k].url!="./assets/img/image-180.png"){
                   flagvideoimg=true;
               }
            }
            if(!flagvideoimg){
              toastr.error("海报至少添加一项", '');
              return;
            }
            for(var t=0;t<$scope.projectRequest.projectFlowList.length;t++){
                if($scope.projectRequest.projectFlowList[t].stepIntro==""){
                  toastr.error("第"+(t+1)+"步字数不能为空", '');
                  return;
                }
            }
            $window.scrollTo(0,0);
            $scope.showStep1=false;
            $scope.showStep2=false;
            $scope.showStep3=true;
        }
        $scope.backnextStep1=function(){
          $window.scrollTo(0,0);
          $scope.showStep1=true;
          $scope.showStep2=false;
          $scope.showStep3=false;
        }

        $scope.listhour=[];
        for(var i=0;i<24;i++){
            $scope.listhour.push(i);
        }
        $scope.selTimeDate={
          selhour:0,
          selsecond:0
        }
        $scope.listsecond=[];
        for(var j=0;j<60;j++){
            $scope.listsecond.push(j);
        }

        $scope.changeHour=function(selhour){
            $scope.selTimeDate.selhour=selhour;
        }
        $scope.changeSecond=function(selsecond){
            $scope.selTimeDate.selsecond=selsecond;
        }
        $scope.showcity=false;
        $scope.showarea=false;

        $scope.getcitylist=function(){
            $http.get('app/pages/service/taste/allprovinces.json').success(function (res) {
                $scope.list = res;
                $scope.list.unshift({name:"请选择省份"});
                $scope.clearOption();
            });
        }
        if($state.current.data.operate=='add'){
          $scope.cgProvice = function (selprovice) {
              if($scope.list[0].name=="请选择省份"){
                  $scope.list.shift();
              }
              $scope.showcity=true;
              $scope.showarea=false;
              $scope.selprovice=selprovice;
              if($scope.selprovice.child[0].name!="请选择城市"){
                  $scope.selprovice.child.unshift({name:"请选择城市"});
              }
              $scope.clearOption();
          };
          $scope.cgCity=function(selcity){
              $scope.selcity=selcity;
              if($scope.selcity==null){
                  $scope.showarea=false;
                  return ;
              }
              if($scope.selcity.name=="请选择城市"){
                  $scope.showarea=false;
                  return ;
              }
              $scope.showarea=true;
              $scope.selarea=$scope.selcity.child[0].value;
              $scope.clearOption();
          }
          $scope.cgArea=function(selarea){
              $scope.selarea=selarea;
              $scope.clearOption();
          }
        }
        if($state.current.data.operate=='edit'){
          $scope.showarea=false;
          $scope.cgProvice = function (selprovice) {
              $scope.selprovice=selprovice;
              $scope.selcity = [];
              for(var i=0;i<$scope.list.length;i++){
                  if($scope.list[i].name==selprovice){
                      $scope.selPchild=$scope.list[i].child;
                      break;
                  }
              }
              if($scope.selPchild[0].name!="请选择城市"){
                  $scope.selPchild.unshift({name:"请选择城市"});
              }
              $scope.selcity=$scope.selPchild[0].name;
              $scope.clearOption();
              $scope.showarea=false;
          };
          $scope.cgCity=function(selcity){
              if(selcity=="请选择城市"){
                  $scope.selcity="请选择城市";
                  $scope.showarea=false;
                  return ;
              }
              $scope.selcity=selcity;
              for(var i=0;i<$scope.list.length;i++){
                  if($scope.list[i].name==$scope.selprovice){
                      $scope.selParea=$scope.list[i].child;
                      for(var j=0;j<$scope.selParea.length;j++){
                          if($scope.selParea[j].name==selcity){
                              $scope.selArea=$scope.selParea[j].child;
                              $scope.showarea=true;
                              $scope.selarea=$scope.selArea[0].value;
                              $scope.clearOption();
                              break;
                          }
                      }
                  }
              }
          }
          $scope.cgArea=function(selarea){
              $scope.selarea=selarea;
              $scope.clearOption();
          }
        }
        //判断是店家还是大人
        $scope.getallAdddata=function(){
            apiRequest.post('/shopAdmin/Project/loadSET', {accountId:adminService.getAdmin().account.id}, function(res) {
                $scope.alladddatalist=res.data;
                if(res.data.hasOwnProperty("expertPerson")){
                    $scope.isexpOrshop=true;
                }
                if(res.data.hasOwnProperty("shop")){
                    $scope.isexpOrshop=false;
                }
                $scope.project={
                  projecttypeId:[]
                };
            });
        }
        //预订日期详情
        $scope.reserveDatedetail=function(reserve_date){
            if(reserve_date.length==0){
                toastr.error("暂未选择日期", '');
                return ;
            }
            $scope.modal={
              reserveDate:reserve_date
            }
            modalsService.normal('app/pages/service/taste/timedetail.html','reservelistCtrl',$scope.modal,function(){});
        }

        $scope.time=[{
            startTime:'',
            endTime:''
        }];
        $scope.time.shift();
        $scope.selprovice="";
        $scope.selcity="";
        $scope.selarea="";

        $scope.hasTimeslot=false;
        $scope.addtimeSet=function(item){
            $scope.modal={
                operate:'add',
                selhour:$scope.selTimeDate.selhour,
                selsecond:$scope.selTimeDate.selsecond,
                totaltime:item
            }
            var vmmodel=$uibModal.open({
                animation: true,
                templateUrl: 'app/pages/service/taste/addtime_tpl.html',
                controller: 'timeCtrl',
                size: 'md',
                resolve: {
                    modal: function() {
                        return $scope.modal;
                    }
                }
            });
            vmmodel.result.then(function(result) {
                $scope.time.push({
                    startTime:result.startTime,
                    endTime:result.endTime
                });
                $scope.hasTimeslot=true;
                if(($scope.selTimeDate.selhour==0)&&($scope.selTimeDate.selsecond==0)){
                    var startArr=$scope.time[0].startTime.split(":");
                    var endArr=$scope.time[0].endTime.split(":");
                    var starthour=parseInt(startArr[0]),startsecond=parseInt(startArr[1]);
                    var endhour=parseInt(endArr[0]),endsecond=parseInt(endArr[1]);
                    if(startsecond<=endsecond){
                        $scope.selTimeDate.selsecond=endsecond-startsecond;
                        if(starthour<=endhour){
                          $scope.selTimeDate.selhour=endhour-starthour;
                          return ;
                        }
                        if(starthour>endhour){
                          $scope.selTimeDate.selhour=endhour+24-starthour;
                          return ;
                        }
                    }
                    if(startsecond>endsecond){
                        $scope.selTimeDate.selsecond=endsecond+60-startsecond;
                        if(starthour<endhour){
                            $scope.selTimeDate.selhour=endhour-starthour-1;
                            return ;
                        }
                        if(starthour>=endhour){
                            $scope.selTimeDate.selhour=endhour+23-starthour;
                            return ;
                        }
                    }
                }
                if($scope.selTimeDate.selsecond==60){
                    $scope.selTimeDate.selsecond=0;
                }
                $scope.clearOption();
            });
        }
        $scope.edittimeSet=function(index,item,time){
            $scope.modal={
                operate:'edit',
                startTime:item.startTime,
                endTime:item.endTime,
                selhour:$scope.selTimeDate.selhour,
                selsecond:$scope.selTimeDate.selsecond,
                totaltime:time
            }
            var vmmodel=$uibModal.open({
                animation: true,
                templateUrl: 'app/pages/service/taste/addtime_tpl.html',
                controller: 'timeCtrl',
                size: 'md',
                resolve: {
                    modal: function() {
                        return $scope.modal;
                    }
                }
            });
            vmmodel.result.then(function(result) {
                $scope.time[index].startTime=result.startTime;
                $scope.time[index].endTime=result.endTime;
            });
        }

        $scope.isNextDay=function(start,end){
            return baUtil.isNextDay(start,end);
        }
        $scope.reserve_date="";
        if($state.current.data.operate=='add'){
          $scope.projectRequest={
              accountId:adminService.getAdmin().account.id,//发布体验项目者id
              address:'',//体验项目所在地址 ,
              duration:'',//时长
              name:'',//体验项目名称
              maxNum:"",//人数上限,0表示人数不限
              price:null,//价格
              projectDateList:[{
                  reserveDate:''
              }],
              projectIntro:'',//项目介绍/体验简介 ,
              projectNotice:'',//预定须知 ,
              projectService:'',//项目包含的服务 ,
              projectTimeFrameList:[{
                  timeFrame:''
              }],//体验时段 ,
              dayTime:0,
              hourTime:0,
              shopId:0,//发布体验店家id ,
              expertPersonId:0,
              teacherIntroId:0,//发布体验老师介绍id
              type:0,//预定日期选择类型
              typeId:'',//项目对应的类型
              url:[],//短视频和海报的url
              projectFlowList:[
                  {
                      step:1,//项目步骤 ,
                      stepIntro:'',//项目步骤介绍 ,
                      //项目步骤图片集 ,
                      stepPhoto:'',
                      stepPhoto1:[{
                          link:'./assets/img/image-180.png'
                      },{
                          link:'./assets/img/image-180.png'
                      },{
                          link:'./assets/img/image-180.png'
                      }]
                  },
                  {
                      step:2,//项目步骤 ,
                      stepIntro:'',//项目步骤介绍 ,
                      //项目步骤图片集 ,
                      stepPhoto:'',
                      stepPhoto1:[{
                          link:'./assets/img/image-180.png'
                      },{
                          link:'./assets/img/image-180.png'
                      },{
                          link:'./assets/img/image-180.png'
                      }]
                  },
                  {
                      step:3,//项目步骤 ,
                      stepIntro:'',//项目步骤介绍 ,
                      //项目步骤图片集 ,
                      stepPhoto:'',
                      stepPhoto1:[{
                          link:'./assets/img/image-180.png'
                      },{
                          link:'./assets/img/image-180.png'
                      },{
                          link:'./assets/img/image-180.png'
                      }]
                  }
              ]
          }
          $scope.projectRequest.projectDateList.shift();

          $scope.detailadd="";
          $scope.projectNotice=[{notice:''},{notice:''},{notice:''}];
          $scope.projectService=[{service:''},{service:''},{service:''}];
          $scope.videoimgUrl=[{url:'./assets/img/image-180.png'},{url:'./assets/img/image-180.png'},{url:'./assets/img/image-180.png'}];
        }

        //添加多个海报或者视频
        $scope.appendMore=function(){
            $scope.videoimgUrl.push({
                url:'./assets/img/image-180.png'
            });
        }

        $scope.deleteItem=function(index,arr){
            if(arr.length<=1){
                return ;
            }
            arr.splice(index,1);
        }
        //添加
        $scope.indexstepId=999;
        $scope.appendstepMore=function(outerIndex,innerIndex){
            $scope.indexstepId+=3;
            $scope.projectRequest.projectFlowList[outerIndex].stepPhoto1.push({
              link:'./assets/img/image-180.png',
              indexstepId:$scope.indexstepId
            });
        }
        //添加步骤
        var addstepId=3;
        /**
         * 添加步骤的时候要实时获取当前步骤数
         * change by yuxiaojing on 2017-7-26
         */
        $scope.addstepMore=function(){
            addstepId = $scope.projectRequest.projectFlowList.length;
            addstepId++ ;
            $scope.projectRequest.projectFlowList.push({
                step:addstepId,
                stepIntro:'',
                stepPhoto1:[{
                    link:'./assets/img/image-180.png'
                }]
            });
        }


        /**
         * 移除步骤，需要遍历步骤数组修改序号索引
         * change by yuxiaojing on 2017-7-26
         */
        $scope.removestepMore=function(index){
            var l = $scope.projectRequest.projectFlowList.length;
            if(l <= 1 ){
                return ;
            }

            for(var i= index+1;i<l;i++){
              $scope.projectRequest.projectFlowList[i].step -- ;
            }
            $scope.projectRequest.projectFlowList.splice(index,1);
        }


        $scope.textInputcount=function(text,num){
            return baUtil.textInputcount(text,num);
        }

        var startWatch=$scope.$watch('reserveDate.reserve_date', function (newValue, oldValue) {
            if(newValue!=oldValue){
                $scope.projectRequest.type=1;
            }
        },true);

        $scope.dateCallback=function(data){
             $scope.projectRequest.type=data.type;
        }

        //清空所有的时间段
        $scope.removeAlltime=function(){
            $scope.time.splice(0,$scope.time.length);
            $scope.hasTimeslot=false;
        }
        //删除单个的时间
        $scope.removetime=function(index,time){
            $scope.time.splice(index,1);
            if(time.length==0){
                $scope.hasTimeslot=false;
            }
        }
        //切换老师
        $scope.teacherCg=function(items,index,id){
          for(var j=0;j<items.length;j++){
            if(j!=index){
              items[j].ischeck=false;
            }
          }
          if(items[index].ischeck){
            $scope.projectRequest.teacherIntroId=id;
          }
          else{
            delete $scope.projectRequest.teacherIntroId;
          }
        }
        $scope.shopexportCg=function(id,check,index){
            //index=1是店家   index=2是达人
            if(index==1){
              if(check){
                  $scope.projectRequest.shopId=id;
              }
              else{
                  delete $scope.projectRequest.shopId;
              }
            }
            if(index==2){
              if(check){
                  $scope.projectRequest.expertPersonId=id;
              }
              else{
                  delete $scope.projectRequest.expertPersonId;
              }
            }
        }


        $scope.addNoticeMore=function(){
          $scope.projectNotice.push({notice:''});
        }
        $scope.addServiceMore=function(){
          $scope.projectService.push({service:''});
        }

        //切换可预订日期
        $scope.changeProtype=function(id){
            $scope.projectRequest.type=id;
        }
        $scope.reserveDate={
          reserve_date:''
        };
        $scope.submit=function(){
             if($scope.projectRequest.projectIntro.length<20){
                toastr.error("体验简介至少20个字", '');
                return;
             }
             var flagservice=false,flagnotice=false;
             for(var i in $scope.projectService){
                if($scope.projectService[i].service!=""&&$scope.projectService[i].service!=null){
                    flagservice=true;
                    break;
                }
             }
             for(var j in $scope.projectNotice){
                if($scope.projectNotice[j].notice!=null&&$scope.projectNotice[j].notice!=''){
                    flagnotice=true;
                    break;
                }
             }
             if(!flagservice){
               toastr.error("包含服务至少添加一项", '');
               return;
             }
             if(!flagnotice){
               toastr.error("预定须知至少添加一项", '');
               return;
             }
             if($state.current.data.operate=='edit'){
               $scope.projectRequest.projectNotice='';$scope.projectRequest.projectService='';
               $scope.projectRequest.projectTimeFrameList=[];
             }
             if($state.current.data.operate=='add'){
               $scope.projectRequest.projectTimeFrameList.shift();
             }
             var serviceArr=[];
             for(var ii in $scope.projectService){
                if($scope.projectService[ii].service!=""){
                  serviceArr.push($scope.projectService[ii].service);
                }
             }
             for(var iii=1;iii<=serviceArr.length;iii++){
               $scope.projectRequest.projectService+=iii+"."+serviceArr[iii-1]+",";
             }
             $scope.projectRequest.projectService=$scope.projectRequest.projectService.substring(0,$scope.projectRequest.projectService.length-1);
             var noticeArr=[];
             for(var jj in $scope.projectNotice){
                if($scope.projectNotice[jj].notice!=""){
                    noticeArr.push($scope.projectNotice[jj].notice);
                }
             }
             for(var jjj=1;jjj<=noticeArr.length;jjj++){
               $scope.projectRequest.projectNotice+=jjj+"."+noticeArr[jjj-1]+",";
             }
             $scope.projectRequest.projectNotice=$scope.projectRequest.projectNotice.substring(0,$scope.projectRequest.projectNotice.length-1);
             if($state.current.data.operate=='edit'){
               $scope.projectRequest.url=[];
             }
             for(var i=0;i<$scope.videoimgUrl.length;i++){
                  if($scope.videoimgUrl[i].url!=="./assets/img/image-180.png"){
                      $scope.projectRequest.url.push($scope.videoimgUrl[i].url);
                  }
             }
             if($scope.projectRequest.type==1){
               if($state.current.data.operate=='edit'){
                 $scope.projectRequest.projectDateList=[];
               }
               for(var i in $scope.reserveDate.reserve_date){
                $scope.projectRequest.projectDateList.push({
                  reserveDate:$scope.reserveDate.reserve_date[i]
                });
              }
            }
            else{
                delete $scope.projectRequest.projectDateList;
            }

            $scope.projectRequest.duration=Math.abs($scope.selTimeDate.selhour)+"小时"+$scope.selTimeDate.selsecond+"分钟";
            $scope.projectRequest.hour=Math.abs($scope.selTimeDate.selhour);
            //类型id
            for(var i=0;i<$scope.time.length;i++){
                var temp=$scope.time[i].startTime+":00-"+$scope.time[i].endTime+":00";
                $scope.projectRequest.projectTimeFrameList.push({
                    timeFrame:temp
                });
            }
            $scope.projectRequest.typeId=$scope.project.projecttypeId.join(",");
            if($state.current.data.operate=='add'){
                  //步骤
                  for(var i=0;i<$scope.projectRequest.projectFlowList.length;i++){
                      var stepPhotolink=[];
                      for(var j=0;j<$scope.projectRequest.projectFlowList[i].stepPhoto1.length;j++){
                        //
                          if($scope.projectRequest.projectFlowList[i].stepPhoto1[j].link!='./assets/img/image-180.png'){
                              stepPhotolink.push($scope.projectRequest.projectFlowList[i].stepPhoto1[j].link);
                          }
                      }
                      $scope.projectRequest.projectFlowList[i].stepPhoto=stepPhotolink.join(",");
                      delete $scope.projectRequest.projectFlowList[i].stepPhoto1;
                  }
                  //地址

                  if($scope.projectRequest.teacherIntroId==0){
                      $scope.projectRequest.teacherIntroId=null;
                  }
                  if(($scope.selarea==null)||(typeof $scope.selarea.value=="undefined")){
                      $scope.selarea={
                          value:''
                      }
                      $scope.selarea.value=$scope.selcity.child[0].value;
                  }
                  $scope.projectRequest.address=$scope.selprovice.name+","+$scope.selcity.name+","+$scope.selarea.value+","+$scope.projectRequest.address;
                  if(($scope.projectRequest.maxNum=='')||($scope.projectRequest.maxNum==null)){
                      $scope.projectRequest.maxNum=-1;
                  }
                  if($scope.projectRequest.expertPersonId==0){
                      delete $scope.projectRequest.expertPersonId;
                  }
                  apiRequest.postJson('/shopAdmin/Project/addProject', $scope.projectRequest, function(res) {
                      if (res.code == "200") {
                          $state.reload();
                          var vmmodel=$uibModal.open({
                              animation: true,
                              templateUrl: 'app/pages/service/taste/add_suctpl.html',
                              controller: 'timeCtrl',
                              size: 'md',
                              resolve: {
                                  modal: function() {
                                      return $scope.modal;
                                  }
                              }
                          });
                      }else {
                          toastr.error(res.message, '');
                          $scope.$apply();
                      }
                  },function(res2){
                      toastr.error(res2.data.message, '');
                  });
            }

            if($state.current.data.operate=='edit'){
                //步骤
                for(var i=0;i<$scope.projectRequest.projectFlowList.length;i++){
                    var stepPhotolink=[];
                    for(var j in $scope.projectRequest.projectFlowList[i].stepPhoto1){
                      if($scope.projectRequest.projectFlowList[i].stepPhoto1[j].link!='./assets/img/image-180.png'){
                          stepPhotolink.push($scope.projectRequest.projectFlowList[i].stepPhoto1[j].link);
                      }
                    }
                    $scope.projectRequest.projectFlowList[i].stepPhoto=stepPhotolink.join(",");
                    delete $scope.projectRequest.projectFlowList[i].stepPhotoList;
                    delete $scope.projectRequest.projectFlowList[i].stepPhoto1;
                    delete $scope.projectRequest.projectFlowList[i].updateTime;
                    delete $scope.projectRequest.projectFlowList[i].createTime;
                    delete $scope.projectRequest.projectFlowList[i].id;
                    delete $scope.projectRequest.projectFlowList[i].projectId;
                    delete $scope.projectRequest.top;
                }
                //地址
                if($scope.selarea==null){
                    $scope.selarea={
                        value:''
                    }
                    for(var i=0;i<$scope.list.length;i++){
                        if($scope.list[i].name==$scope.selprovice){
                            $scope.selParea=$scope.list[i].child;
                            for(var j=0;j<$scope.selParea.length;j++){
                                if($scope.selParea[j].name==$scope.selcity){
                                    $scope.selArea=$scope.selParea[j].child;
                                    $scope.selarea.value=$scope.selArea[0].value;
                                    break;
                                }
                            }
                        }
                    }
                }
                if(typeof $scope.selarea.value=="undefined"){
                    $scope.projectRequest.address=$scope.selprovice+","+$scope.selcity+","+$scope.selarea+","+$scope.projectRequest.address2;
                }
                else{
                    $scope.projectRequest.address=$scope.selprovice+","+$scope.selcity+","+$scope.selarea.value+","+$scope.projectRequest.address2;
                }

                if($scope.projectRequest.teacherIntroId==0){
                    $scope.projectRequest.teacherIntroId=null;
                }
                delete $scope.projectRequest.projectTypeList;
                delete $scope.projectRequest.shoperName;
                delete $scope.projectRequest.remark;
                delete $scope.projectRequest.handleTime;
                delete $scope.projectRequest.applyTime;
                delete $scope.projectRequest.isOnself;
                delete $scope.projectRequest.account;
                delete $scope.projectRequest.updateTime;
                if($scope.projectRequest.shop==null){
                    $scope.projectRequest.expertPersonId=$scope.projectRequest.expertPerson.id;
                }
                else{
                    $scope.projectRequest.shopId=$scope.projectRequest.shop.id;
                }
                delete $scope.projectRequest.expertPerson;
                delete $scope.projectRequest.shop;
                $scope.projectRequest.projectId=$scope.projectRequest.id;
          $scope.projectRequest.hour=Math.abs($scope.selTimeDate.selhour);
                delete $scope.projectRequest.id;
                if(($scope.projectRequest.maxNum=='')||($scope.projectRequest.maxNum==null)){
                    $scope.projectRequest.maxNum=-1;
                }
                apiRequest.postJson('/shopAdmin/Project/updateProject', $scope.projectRequest, function(res) {
                    if (res.code == "200") {
                        toastr.success('修改成功');
                        $state.go("service.taste", {}, {reload: true});
                    }else {
                        toastr.error(res.message, '');
                        $scope.$apply();
                    }
                },function(res2){
                    toastr.error(res2.data.message, '');
                });
            }
        }
        $scope.uploadCallback = function(data) {
          vm.res=false;
          $timeout(function(){
             if(!vm.res){
                vm.res=true;
                toastr.error("上传超时，请重试", '');
             }
          },20000);
        }

        function init() {
            vm.token = IMAGE_UPLOAD.token;
            vm.link = QINIU_LINK;
        }
        vm.key = {
            value: null
        };
    }
})();
