(function() {
  "use strict";
  angular.module("starter.order").controller("PayCtrl", PayCtrl);

  /** @ngInject */
  function PayCtrl(
    $scope,
    ionicDatePicker,
    applyApi,
    $interval,
    $ionicHistory,
    homeService,
    $stateParams,
    AuthService,
    $state,
    $ionicPopup,
    $ionicModal,
    $q,
    $rootScope
  ) {
    $scope.exitPay = exitPay;
    $scope.pay = pay;
    $scope.payType = {
      type: 2
    };
    init();

    function init() {
      var result = JSON.parse($stateParams.data), time = result.expiredTime;
      console.log($rootScope, 'rootscopr');
      $scope.totalTime =
        new Date(
          time[0] +
            "/" +
            time[1] +
            "/" +
            time[2] +
            " " +
            time[3] +
            ":" +
            time[4] +
            ":" +
            time[5]
        ) - new Date();
      $scope.payNo = result.payNo;
      $scope.amount = result.money;
      $scope.wxPayJs = result.wxPayJs;
      freshRemainTime();
    }

    function freshRemainTime(orderId) {
      $scope.timer = $interval(function() {
        if ($scope.totalTime > 0) {
          $scope.totalTime -= 1000;
          $scope.countdownTime = {
            m: Math.floor(parseInt($scope.totalTime % 3600000 / 60000)),
            s: Math.floor(parseInt($scope.totalTime % 60000 / 1000))
          };
        } else {
          $interval.cancel($scope.timer);
          $state.go("myOrder");
          showAlert("已超过支付时间，请重新下单!");
        }
      }, 1000);
    }

    function exitPay(params) {
      showConfirm("是否取消支付订单");
    }

    function pay() {
      var params = {};
      if ($scope.payType.type === 2) {
        params.tradeNo = $scope.payNo;
        applyApi.post(
          "order/balance-pay",
          params,
          function(rel) {
            homeService.clearCart();
            checkOrderType();
          },
          function(error) {
            showAlert(error.data.message);
          }
        );
      } else {
        if (!$scope.wxPayJs) {
          applyApi.post(
            "order/wx-pay-js",
            {
              tradeNo: $scope.payNo
            },
            function(rel) {
              params = JSON.parse(rel.data);
              AuthService.payMoney(params, function() {
                checkOrderType();
              });
            },
            function(error) {
              showAlert(error.data.message);
              console.log("余额支付 error");
            }
          );
        } else {
          params = JSON.parse($scope.wxPayJs);
          AuthService.payMoney(params, function() {
            checkOrderType();
          });
        }
      }
    }

    function showAlert(type) {
      var alertPopup = $ionicPopup.alert({
        title: "提示",
        template: type
      });
    }

    /**
     * 取消订单对话框
     * 团购订单和普通订单跳转不同的state
     * @param {any} tip 
     */
    function showConfirm(tip) {
      var confirmPopup = $ionicPopup.confirm({
        title: "提示",
        template: tip,
        buttons: [
          {
            text: "支付",
            type: "button-positive"
          },
          {
            text: "取消",
            onTap: function(e) {
              homeService.clearCart();
              if ($rootScope.groupId !== void 0 ) {
                console.log("团购未支付");
                $state.go("groupBut");
              } else {
                console.log("未支付订单，进入我的订单列表");
                $state.go("myOrder");
              }
            }
          }
        ]
      });
    }
    $scope.couponObtain = couponObtain;

    $scope.$on("$destroy", function() {
      // 切换state后remove不掉，可以改成remove后切换state！
      $scope.modal && $scope.modal.remove();
    });
    $scope.closeModal = function() {
      $scope.modal && $scope.modal.hide();
      $state.go("myOrder");
    };

    /**
     * 弹出用户所获的的红包
     * 
     */
    function couponObtain() {
      $ionicModal
        .fromTemplateUrl("app/coupons/coupon-obtain/coupon-obtain.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
    }

    /**
     * 获取下单赠送的红包
     * 
     */
    function getOrderCoupon() {
      applyApi.post(
        "coupon/order-coupon",
        {
          amount: $scope.amount
        },
        function(rel) {
          $scope.coupons = [rel.data];
          couponObtain();
        },
        function(error) {
          console.log("获取下单红包失败");
        }
      );
    }

    /**
     * 检查管理员是否开启下单赠送红包
     * 
     */
    function checkCouponIsOpen() {
      applyApi.post(
        "coupon/check",
        {
          type: 0
        },
        function(rel) {
          // 管理员开启下单赠送红包
          if (rel.data.value1 === 1) {
            getOrderCoupon();
          } else {
            $state.go("myOrder");
          }
        },
        function(error) {
          console.log("检测红包开启失败");
          $state.go("myOrder");
        }
      );
    }

    /**
     * 检查订单类别
     * 团购 or 非团购 
     */
    function checkOrderType() {
      var isGroup = $stateParams.isGroup;
      // 团购订单
      if (isGroup === "0") {
        // 团购付款完成后最好能够给我一个团购标志
        console.log("%c团购订单付款完成");
        var groupId = $rootScope.groupId;
        console.log(groupId, "团购Id");
        $state.go("groupShare", {
          groupId: groupId,
          userId: "isMakeGroup"
        });
      } else {
        // 非团购
        checkCouponIsOpen();
      }
    }
  }
})();
