
(function () {
    'use strict';

angular.module('BlurAdmin.pages.business')
    .controller('timeCtrl', timeCtrl);

function timeCtrl($scope,$state, $uibModalInstance,toastr,modal) {
    $scope.startdis=false;
    $scope.enddis=false;
    $scope.hourData=[];$scope.secondData=[];
    for(var i=0;i<24;i++){
      $scope.hourData.push(i);
    }
    for(var i=0;i<60;i++){
      $scope.secondData.push(i);
    }
    $scope.seltimeHour=function(hour,seIndex){
      hour=hour<10?'0'+hour:hour;
      if(seIndex==1){
        $scope.time.startTime=hour+$scope.time.startTime.substring(2,5);
      }
      if(seIndex==2){
        $scope.time.endTime=hour+$scope.time.endTime.substring(2,5);
      }
    }
    $scope.seltimeSecond=function(second,seIndex){
      second=second<10?'0'+second:second;
      if(seIndex==1){
        $scope.time.startTime=$scope.time.startTime.substring(0,3)+second;
      }
      if(seIndex==2){
        $scope.time.endTime=$scope.time.endTime.substring(0,3)+second;
      }
    }
    if(modal.operate=='edit'){
        $scope.time= {
            startTime:modal.startTime,
            endTime:modal.endTime
        }
    }
    if(modal.operate=='add'){
        $scope.time={
            //给默认值
            startTime:"00:00",
            endTime:"00:00"
        }
    }
    //确定了时长，走这条路径
    if((modal.selhour!=0||modal.selsecond!=0)){
        var startWatch=$scope.$watch('time.startTime', function (newValue, oldValue) {
                if (newValue!=oldValue) {
                    endWatch();
                    var startTime=$scope.time.startTime.split(":");
                    var startmin=parseInt(startTime[1])+modal.selsecond;
                    if(startmin<60){
                        var endhour=parseInt(startTime[0])+modal.selhour;
                        $scope.time.endTime=endhour+":"+startmin;
                    }
                    if(startmin>=60){
                        var endhour=parseInt(startTime[0])+modal.selhour+1;
                        startmin-=60;
                    }
                    if(endhour>=24){
                      endhour-=24;
                    }
                    startmin=startmin<10?'0'+startmin:startmin;
                    endhour=endhour<10?'0'+endhour:endhour;
                    $scope.time.endTime=endhour+":"+startmin;
                    $scope.showendtimedis=false;
                }
            });
        var endWatch=$scope.$watch('time.endTime', function (newVal, oldVal) {
                if (newVal!=oldVal) {
                    startWatch();
                    var endTime=$scope.time.endTime.split(":");
                    if(parseInt(endTime[1])>modal.selsecond){
                        var endmin=parseInt(endTime[1])-modal.selsecond;
                        if(parseInt(endTime[0])<modal.selhour){
                            var endhour=parseInt(endTime[0])-modal.selhour+24;
                        }
                        if(parseInt(endTime[0])>=modal.selhour){
                            var endhour=parseInt(endTime[0])-modal.selhour;
                        }
                    }
                    if(parseInt(endTime[1])<=modal.selsecond){
                        var endmin=parseInt(endTime[1])+60-modal.selsecond;
                        if(parseInt(endTime[0])<modal.selhour){
                            var endhour=modal.selhour-parseInt(endTime[0]);
                            endhour--;
                        }
                        if(parseInt(endTime[0])>modal.selhour){
                            var endhour=parseInt(endTime[0])-modal.selhour;
                            endhour--;
                        }
                        if(parseInt(endTime[0])==modal.selhour){
                            var endhour=23;
                        }
                        if(parseInt(endTime[1])==modal.selsecond){
                            endmin=0;
                            endhour++;
                            if(endhour==24){
                              endhour=0;
                            }
                        }
                    }
                    endmin=endmin<10?'0'+endmin:endmin;
                    endhour=endhour<10?'0'+endhour:endhour;
                    $scope.time.startTime=endhour+":"+endmin;
                    $scope.showstarttimedis=false;
                }
            });
    }

    //没有时长，走这条路径
    $scope.submit = function(){
        //if(modal.selhour==0||modal.selsecond==0){
        //    if($scope.time.startTime>$scope.time.endTime){
        //        toastr.error("开始时间不能大于结束时间", '');
        //        return;
        //    }
        if(angular.equals($scope.time.startTime,$scope.time.endTime)){
            toastr.error("开始时间不能等于结束时间", '');
            return;
        }
        for(var i=0;i<modal.totaltime.length;i++){
            if((modal.totaltime[i].startTime==$scope.time.startTime)&&(modal.totaltime[i].endTime==$scope.time.endTime)){
                toastr.error("请勿重复添加相同时间段", '');
                return ;
            }
            var tempolds=parseInt(modal.totaltime[i].startTime.replace(/:/g,""));
            var tempolde=parseInt(modal.totaltime[i].endTime.replace(/:/g,""));
            var tempnews=parseInt($scope.time.startTime.replace(/:/g,""));
            var tempnewe=parseInt($scope.time.endTime.replace(/:/g,""));
            if(((tempolds>tempnews)&&(tempnewe>tempolds))||((tempolds<tempnews)&&(tempnews<tempolde))){
                if(modal.operate=='edit'){
                  if(modal.totaltime.length!=1){
                    toastr.error("时间段有重叠部分", '');
                    return ;
                  }
                }
                if(modal.operate=='add'){
                  toastr.error("时间段有重叠部分", '');
                  return ;
                }
            }
        }
        $uibModalInstance.close($scope.time);
    };
}

})();
