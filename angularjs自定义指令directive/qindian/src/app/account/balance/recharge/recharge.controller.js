(function() {
  "use strict";
  angular.module("starter.account").controller("rechargeCtrl", rechargeCtrl);

  /** @ngInject */
  function rechargeCtrl(applyApi, AuthService, $ionicHistory, $ionicPopup) {
    var vm = this;
    vm.recharge = recharge;
    vm.params = {
      money: 50
    };
    vm.rule = {};
    checkRule();
    function recharge() {
      console.log("充值金额", vm.params);
      var params;
      applyApi.post(
        "order/charge",
        vm.params,
        function(rel) {
          console.log("充值返回", rel);
          params = JSON.parse(rel.data.wxPayJs);
          AuthService.payMoney(params, function() {
            payResult("余额充值成功");
            presented(rel);
            $ionicHistory.goBack(-1);
          });
        },
        function() {
          console.log("充值 error");
        }
      );
    }

    // 一个提示对话框
    function payResult(result) {
      var alertPopup = $ionicPopup.alert({
        title: "支付结果",
        template: result
      });
      alertPopup.then(function(res) {
        console.log("Thank you for not eating my delicious ice cream cone");
      });
    }

    function presented() {
      applyApi.post(
        "order/wxpayed",
        vm.params,
        function(rel) {
          console.log("充值返回", rel);
          params = JSON.parse(rel.data.wxPayJs);
          AuthService.payMoney(params, function() {
            payResult("余额充值成功");

            $ionicHistory.goBack(-1);
          });
        },
        function() {
          console.log("充值 error");
        }
      );
    }

    /**
     * 查询红包满送规则
     * 
     */
    function checkRule() {
      applyApi.post(
        "rechargeRole/select-useRule",
        {},
        function(rel) {
          console.log("规则返回", rel);
          angular.forEach(rel.data, function (value,index) {
            vm.rule[value.money] = value.annexation
          })
        },
        function() {
          console.log("充值 error");
        }
      );
    }
  }
})();
