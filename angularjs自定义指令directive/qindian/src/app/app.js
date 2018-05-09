angular.module('starter',[
    'ionic',

    'starter.routes',
    'starter.controllers',
    'starter.services',
    'starter.directives',
    'starter.filter',
    'starter.configs',

    // 'starter.menu',
    'starter.home',
    'starter.account',
    'starter.search',
    'starter.location',
    'starter.order',
    'templates',
    'ionic-datepicker',
    'starter.groupBuy',
    'stater.couponShare',
    'stater.mock' ,//模拟登录,
    'starter.pick'
])

.config(['$httpProvider',function($httpProvider) {
    //$http模块POST请求request payload转form data  删除值为null 的参数
    $httpProvider.defaults.transformRequest = function(obj) {
        var str = [];
        for (var p in obj) {
            if(obj[p] === null){
                delete obj[p];
            }else{
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
        return str.join("&");
    };

    $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
}])
.config(['$ionicConfigProvider',function($ionicConfigProvider) {

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-ios-arrow-left');

    //修改返回按钮的文字
    $ionicConfigProvider.backButton.text('返回');
    $ionicConfigProvider.backButton.previousTitleText(false);

}])
.config(['ionicDatePickerProvider', function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: '选择配送日期',
      setLabel: '选择',
      todayLabel: '今天',
      closeLabel: '取消',
      mondayFirst: false,
      weeksList: ["日", "一", "二", "三", "四", "五", "六"],
      monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      showTodayButton: false,
      dateFormat: 'YYYY/MM/DD',
      closeOnSelect: false,
    //   disableWeekdays: [0, 6]
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  }]);
