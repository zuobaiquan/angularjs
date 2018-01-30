(function () {
  'use strict';

angular.module('BlurAdmin.theme')
 .directive("mydatetimePicker", function() {
   return {
        template: function(elem, attrs) {
          var html="";
          html+='<div class="datepicker-container">';
          html+='<input class="picker-input" readonly="true" ng-model="result" placeholder="点击添加时间" ng-click="showPicker()" />';
          html+='<img class="picker-img" ng-src="assets/img/datepicker.png" />';
          html+='<div ng-show="showpick" class="picker-con">';
          html+='<div class="picker-contop">';
          html+='<span ng-click="preMonth()" class="contop-pre">'+'<';
          html+='</span>';
          html+='<span class="contop-middle">'+'{{currentYear}}-{{currentMonth}}'+'</span>';
          html+='<span ng-click="nextMonth()" class="contop-next">'+'>';
          html+='</span>';
          html+='</div>';
          html+='<div class="picker-eachday" ng-repeat="item in weekList track by $index"><span class="eachday-text">{{item}}</span></div>';
          html+='<div class="picker-eachday" ng-repeat="item in datelist track by $index"><span class="each-text" ng-style="selDatestyle(item.year,item.month,item.showDate)" ng-click="selectDate(item.year,item.month,item.showDate)">{{item.showDate}}</span></div>';
          html+='<div class="picker-buttom" ng-click="hiddenPicker()">确定</div>';
          html+='</div>';
          html+='</div>';
          return html;
        },
        restrict: 'AE',
        scope: {
            result: '=',
            showpick:"@",
            chooseStyle:'@',
            callback:"&"
        },
        link: function(scope, element, attributes) {
          if(scope.result==''||typeof scope.result=='undefined'){
            scope.result=[];
          }
          scope.chooseStyle=[];
          var today = new Date();
          var nowyear2=today.getFullYear(),nowmonth2= today.getMonth() + 1,nowday2=today.getDate();
          var year = today.getFullYear();
          var month = today.getMonth() + 1;
          scope.showPicker=function(){
              scope.showpick=!scope.showpick;
          }
          scope.hiddenPicker=function(){
              scope.showpick=false;
              if(scope.callback){
                scope.callback({data:{
                   type:1
                }});
             }
          }
          scope.selectDate=function(year,month,day){
              //不能选过去的时间
              if((year<nowyear2)||(year==nowyear2&&month<nowmonth2)||(year==nowyear2&&month==nowmonth2&&day<nowday2)){
                  return ;
              }
              month=parseInt(month)<10?('0'+month):month;
              day=parseInt(day)<10?('0'+day):day;
              var newdate=year+"-"+month+"-"+day;
              for(var j in scope.result){
                if(scope.result[j]==newdate){
                    scope.result.splice(j,1);
                    return ;
                }
              }
              scope.result.push(newdate);
          }
        },
        controller:function($scope){
          $scope.weekList=['一','二','三','四','五','六','日'];
          $scope.init=function(year,month){
            var firstDay = new Date(year, month - 1, 1);
            var firstDayWeekDay = firstDay.getDay();
            if (firstDayWeekDay === 0) {
                firstDayWeekDay = 7;
            }
            var year = firstDay.getFullYear(),
            month = firstDay.getMonth() + 1,
            day = firstDay.getDate(),
            lastDayOfLastMonth = new Date(year, month - 1, 0),
            lastDateOfLastMonth = lastDayOfLastMonth.getDate(),
            preMonthDayCount = firstDayWeekDay - 1,
            lastDay = new Date(year, month, 0),
            lastDate = lastDay.getDate();
            $scope.datelist=[];
            for (var i = 0; i < 7 * 6; i++) {
                var date = i + 1 - preMonthDayCount;
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
                    month: thisMonth,
                    date: date,
                    showDate: showDate
                });
            }
          }
          var today = new Date(),
          year = today.getFullYear(),
          month = today.getMonth() + 1,
          nowyear1=today.getFullYear(),
          nowmonth1=today.getMonth() + 1;
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
          $scope.selDatestyle=function(year,month,day){
            $scope.colorStyle={};
            var month=parseInt(month)<10?('0'+month):month;
            var day=parseInt(day)<10?('0'+day):day;
            var nowdatetime=year+'-'+month+'-'+day;

            var todaydate = new Date(),
            todayyear = todaydate.getFullYear(),
            todaymonth = todaydate.getMonth() + 1,
            todayday = todaydate.getDate();
            if((year<todayyear)||(year==todayyear&&month<todaymonth)||(year==todayyear&&month==todaymonth&&day<todayday)){
               $scope.colorStyle={'background-color':'#CBC4C4'};
            }
            for(var i in $scope.result){
                if(nowdatetime==$scope.result[i]){
                   $scope.colorStyle={'background':'#FA5050','color':'#ffffff'};
                   return $scope.colorStyle;
                }
            }
            return $scope.colorStyle;
          }
        }
    }
})
})();
