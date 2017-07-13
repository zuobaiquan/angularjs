var app = angular.module('myApp',[])
.directive('customTags',function(){
    return {
        template: function(elem, attrs) {
          var html="";
          html+='<div style="position:relative">';
          html+='<div ng-click="showPicker()" style="border: 1px solid #cccccc;border-radius: 4px;padding: 5px;height: 24px;line-height: 24px;width: auto">{{showselDatelist(result)}}</div>';
          html+='<div ng-show="showpick" style="height:266px;width:266px;background:#ffffff;position:absolute;left:0;top:24;z-index:999;">';
          html+='<div style="height:36px;width:266px;text-align:center;background:#ddd;">';
          html+='<span ng-click="preMonth()" style="width:43px;text-align:center;display:inline-block;cursor:pointer;">'+'<';
          html+='</span>';
          html+='<span style="height:36px;line-height:36px;width:180px;display:inline-block;">'+'{{currentYear}}-{{currentMonth}}'+'</span>';
          html+='<span ng-click="nextMonth()" style="width:43px;text-align:center;display:inline-block;cursor:pointer;">'+'>';
          html+='</span>';
          html+='</div>';
          html+='<div style="border: 1px solid #f0f0f0;display:inline-block;text-align:center;cursor:pointer;" ng-repeat="item in weekList track by $index"><span style="height:36px;line-height:36px;width:36px;display:inline-block">{{item}}</span></div>';
          html+='<div style="border: 1px solid #f0f0f0;display:inline-block;text-align:center;cursor:pointer;" ng-repeat="item in datelist track by $index"><span style="height:36px;line-height:36px;width:36px;display:inline-block" ng-style="selDatestyle(item.year,item.month,item.showDate)" ng-click="selectDate(item.year,item.month,item.showDate)">{{item.showDate}}</span></div>';
          html+='<div style="height:36px;line-height:36px;width:266px;text-align:center;background:#ddd;" ng-click="hiddenPicker()">确定</div>';
          html+='</div>';
          html+='</div>';
          return html;
        },
        restrict: 'AE',
        scope: {
            result: '=',
            showpick:"@",
            chooseStyle:'@'
        },
        link: function(scope, element, attributes) {
          scope.result=[];
          scope.chooseStyle=[];
          var today = new Date();
          var nowyear2=today.getFullYear(),nowmonth2= today.getMonth() + 1,nowday2=today.getDate();

          year = today.getFullYear();
          month = today.getMonth() + 1;
          scope.showPicker=function(){
              scope.showpick=!scope.showpick;
          }
          scope.hiddenPicker=function(){
              scope.showpick=false;
          }
          scope.selectDate=function(year,month,day){
              //不能选过去的时间
              if((year<nowyear2)||(year==nowyear2&&month<nowmonth2)||(year==nowyear2&&month==nowmonth2&&day<nowday2)){
                  return ;
              }
              month=parseInt(month)<10?('0'+month):month;
              day=parseInt(day)<10?('0'+day):day;
              var newdate=year+"-"+month+"-"+day;
              for(var j=0;j<scope.result.length;j++){
                if(scope.result[j]==newdate){
                    scope.result.splice(j,1);
                    return ;
                }
              }
              scope.result.push(newdate);
          }
        },
        controller:function($scope){
          $scope.weekList=['日','一','二','三','四','五','六'];
          $scope.init=function(year,month){
            var firstDay = new Date(year, month - 1, 1);//取得当前月份1号
            var firstDayWeekDay = firstDay.getDay();//取得当前月份1号是星期几
            if (firstDayWeekDay === 0) { //当为星期日（0）时，将值重新设置为7
                firstDayWeekDay = 7;
            }
            year = firstDay.getFullYear();
            month = firstDay.getMonth() + 1;
            day = firstDay.getDate();
            var lastDayOfLastMonth = new Date(year, month - 1, 0); //获取上个月最后一天的日期
            var lastDateOfLastMonth = lastDayOfLastMonth.getDate();//通过最后一天的日期获取上个月总天数
            var preMonthDayCount = firstDayWeekDay - 1; //上个月需要显示出来的天数
            var lastDay = new Date(year, month, 0);//取得当前月份最后一天的日期
            var lastDate = lastDay.getDate(); //通过最后一天的日期获取当前月总天数
            $scope.datelist=[];
            for (var i = 0; i < 7 * 6; i++) {
                var date = i + 1 - preMonthDayCount;//date用于计算显示的是几号
                var showDate = date;
                var thisMonth = month;
                if (date <= 0) {
                    thisMonth = month - 1;
                    showDate = lastDateOfLastMonth + date;
                } else if (date > lastDate) {
                    thisMonth = month + 1;
                    showDate = showDate - lastDate;
                }
                if (thisMonth === 0) {
                    thisMonth = 12;
                }
                if (thisMonth === 13) {
                    thisMonth = 1;
                }
                $scope.datelist.push({
                    year:year,
                    month: thisMonth, //当前表格需要显示的是哪个月份的日期
                    date: date, //date用于计算显示的是几号
                    showDate: showDate //当前需要显示几号
                });
            }
          }
          var today = new Date();
          year = today.getFullYear();
          month = today.getMonth() + 1;
          var nowyear1=today.getFullYear();
          var nowmonth1=today.getMonth() + 1;
          $scope.currentYear=year;
          $scope.currentMonth=month;
          $scope.init(year,month);
          $scope.nextMonth=function(){
            month++;
            $scope.currentMonth=month;
            $scope.currentYear=year;
            $scope.init(year,month);
            if(month==13){
              $scope.currentMonth=month=1;
              var curyear=year=year+1;
              $scope.currentYear=curyear;
            }
          }
          $scope.preMonth=function(){
            //不能选过去的时间
            if((nowyear1>year)||(nowyear1==year&&month<=nowmonth1)){
              return ;
            }
            month--;
            $scope.init(year,month);
            $scope.currentYear=year;
            $scope.currentMonth=month;
            if(month==0){
              $scope.currentMonth=month=12;
              var curyear=year=year-1;
              $scope.currentYear=curyear;
            }
          }
          $scope.showselDatelist=function(item){
             return item.join(",");
          }
          $scope.selDatestyle=function(year,month,day){
            month=parseInt(month)<10?('0'+month):month;
            day=parseInt(day)<10?('0'+day):day;
            var nowdatetime=year+'-'+month+'-'+day;
            console.log(nowdatetime,$scope.result);
            for(var i=0;i<$scope.result.length;i++){
                if(nowdatetime==$scope.result[i]){
                   return {'background':'red'}
                }
            }
            return {'background':''}
          }
        }
    }
})
app.controller('firstController', function ($scope) {

});
