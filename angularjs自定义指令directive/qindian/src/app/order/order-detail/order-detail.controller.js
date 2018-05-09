(function() {
  "use strict";
  angular
    .module("starter.order")
    .controller("OrderDetailCtrl", OrderDetailCtrl);

  /** @ngInject */
  function OrderDetailCtrl(
    $scope,
    applyApi,
    $stateParams,
    $filter,
    $interval,
    $state,
    $ionicPopup,
    $ionicHistory,
    AuthService,
    APP,
    ServerConfiguration,
    verify
  ) {
    // $scope.type = $stateParams.type

    $scope.countdownTime = {};
    $scope.cancelOrder = cancelOrder;
    $scope.payOrder = payOrder;
    $scope.promptShare = promptShare;

    getOrderDetail();
    checkCoupon();
    foodTypes();
    function getOrderDetail() {
      var params = {
        orderId: parseFloat($stateParams.order)
      };
      applyApi.post(
        "order/detail",
        params,
        function(rel) {
          $scope.order = rel.data;
          console.log("订单详情信息", $scope.order);
          countDown();
        },
        function() {
          console.log("detail error");
        }
      );
    }

    function countDown() {
      var time = $scope.order.payRecord.expiredTime,
        downTime =
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
          ) - new Date(),
        timer;
      if ($scope.order.status === 0 && downTime > 0) {
        $scope.countdownTime = {
          m: Math.floor(parseInt(downTime % 3600000 / 60000)),
          s: Math.floor(parseInt(downTime % 60000 / 1000))
        };
        timer = $interval(function() {
          if (downTime > 0) {
            downTime -= 1000;
            $scope.countdownTime = {
              m: Math.floor(parseInt(downTime % 3600000 / 60000)),
              s: Math.floor(parseInt(downTime % 60000 / 1000))
            };
          } else {
            $interval.cancel(timer);
          }
        }, 1000);
      } else {
        $scope.banPay = true;
      }
    }

    function cancelOrder() {
        var confirmPopup = $ionicPopup.confirm({
          title: "提示",
          template: '是否确定取消订单',
          buttons: [
            {
              text: "确定",
              type: "button-positive",
              onTap:function(e){
                  var params = {
                    tradeNo: $scope.order.orderNo
                  };
                  applyApi.post(
                    "order/cancel-order",
                    params,
                    function(rel) {
                      showAlert("取消订单成功");
                      $ionicHistory.goBack(-1);
                      // $scope.order = rel.data;
                    },
                    function(error) {
                      showAlert("取消订单失败");
                    }
                  );
              }
            },
            {
              text: "取消",
              onTap: function(e) {

              }
            }
          ]
        });

    }

    function payOrder() {
      var params = {};

      if ($scope.banPay) {
        showAlert("订单超过截止支付时间");
        return;
      }

      params.expiredTime = $scope.order.payRecord.expiredTime;
      params.payNo = $scope.order.payRecord.payNo;
      params.money = $scope.order.price;
      $state.go("payOrder", {
        data: JSON.stringify(params),
        // 0 团购付款 1 非团购付款
        isGroup: 0
      });
    }

    // 一个提示对话框
    function showAlert(content) {
      var alertPopup = $ionicPopup.alert({
        title: "提示",
        template: content
      });
    }

    if (!APP.devMode) {
      var shareData = {
        title: "我和你不止是工作关系",
        desc: "来抢个红包吧",
        imgUrl: "http://ooadwu9pq.bkt.clouddn.com/Fvc7QSOhsUKEvbv3tvi6C80qJdCH",
        link: ServerConfiguration.domain +
          ServerConfiguration.webRoot +
          "?v=1#/coupon-share/" +
          $stateParams.order
      };
      AuthService.setShareConfig(shareData, null);
    }
    function promptShare() {
      verify.tooltip("右上角分享，给朋友送红包");
    }
    function checkCoupon() {
      applyApi.post(
        "coupon/check",
        {
          type: 1
        },
        function(rel) {
          // 管理员开启分享赠送红包
          if (rel.data.value1 === 1) {
            AuthService.showShareMenuItems();
            $scope.isShare = true;
          }
        },
        function(error) {
          console.log("检测红包开启失败");
          $state.go("myOrder");
        }
      );
    }

    function foodTypes() {
      applyApi.post(
        "type-food/selectFoodType",
        {},
        function(rel) {
          processType(rel.data);
        },
        function() {
          console.log("获取分类列表失败");
        }
      );
    }

    function processType(types) {
      var obj = {};
      angular.forEach(types, function(value, index) {
        obj[value.id] = value;
      });
      $scope.typeObj = obj;
    }
  }
})();
