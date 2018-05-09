(function() {
  "use strict";
  angular
    .module("stater.couponShare")
    .controller("couponShareCtrl", couponShareCtrl);

  /** @ngInject */
  function couponShareCtrl(applyApi, $stateParams, verify, $state) {
    var vm = this;

    init();

    function init() {
      checkAccess();
    }

    function checkAccess() {
      var params = {
        orderId: $stateParams.orderId
      };
      applyApi.post(
        "coupon/random-check",
        params,
        function(rel) {
          console.log("允许用户领取红包");
          obtainCoupon();
        },
        function(error) {
          console.error("分享红包检查失败");
          verify.tooltip(error.data.message || '红包无法领取');
          setTimeout(function() {
            $state.go('home')
          }, 1000);
        }
      );
    }

    function obtainCoupon() {
      applyApi.post(
        "coupon/random-coupon",
        {orderId: $stateParams.orderId},
        function(rel) {
          vm.coupon = rel.data;
          verify.tooltip('成功领取优惠券');
          console.log(rel,'用户获得红包信息');
        },
        function() {
          console.error("获得红包失败");
        }
      );
    }
  }
})();
