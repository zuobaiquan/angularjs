(function () {
  'use strict';

  angular
    .module('starter.account')
    .controller('myCouponCtrl', myCouponCtrl);

  /** @ngInject */
  function myCouponCtrl(applyApi, $stateParams, $ionicHistory, homeService, $ionicPopup) {
    var vm = this;
    vm.goBack = goBack;

    init();

    function init() {
      getList();
    }

    function getList() {
      applyApi.post('coupon/list', {
          // 0表示查询有效的优惠券
          status: $stateParams.status
        },
        function (rel) {
          console.log('%c获取优惠券列表成功', 'color:green;');
          vm.coupons = rel.data;
        },
        function (reason) {
          console.log('%c获取优惠券列表错误', 'font-size:20px;color:red;');
        });
    }

    function goBack() {
      $ionicHistory.goBack(-1);
    }

    function showAlert(type) {
      var alertPopup = $ionicPopup.alert({
        title: '提示',
        template: type
      });
    }

  }

}());
