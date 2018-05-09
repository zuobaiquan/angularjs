(function() {
  "use strict";
  angular.module("starter.groupBuy").controller("groupCtrl", groupCtrl);

  /** @ngInject */
  function groupCtrl(applyApi, $ionicPopup, QINIU_LINK, $state, $scope) {
    var vm = this;
    vm.orderResult = [0, 2, 3, 4, 5, 6];
    vm.changeState = changeState;
    vm.groupOrders = groupOrders;
    vm.QINIU_LINK = QINIU_LINK;
    vm.cancelOrder = cancelOrder;
    vm.payGroupOrder = payGroupOrder;
    vm.detail = detail;
    vm.noMore = true;
    vm.orders = [];
    vm.tag = {
      code: 0,
      page: 0
    };

    function changeState(evt) {
      var activeEle = angular.element(
        document.querySelector(".state--item.state__active")
      );
      if (!angular.equals(activeEle[0], evt.target)) {
        vm.tag.code = vm.tag.code === 0 ? 1 : 0;
        vm.orders = [];
        vm.noMore = true;
        groupOrders();
      }
      activeEle.removeClass("state__active");
      angular.element(evt.target).addClass("state__active");
    }

    function groupOrders() {
      ++vm.tag.page;
      applyApi.post(
        "group/mylist",
        vm.tag,
        function(rel) {
          if (
            angular.equals(
              vm.orders[vm.orders.length - 1],
              rel.data.list[rel.data.list.length - 1]
            )
          ) {
            $scope.$broadcast("scroll.infiniteScrollComplete");
            vm.noMore = false;
          } else {
            vm.orders = vm.orders.concat(rel.data.list);
            $scope.$broadcast("scroll.infiniteScrollComplete");
          }
          if (vm.orders.length === 0) {
            $scope.noMore = false;
          }
          if (!vm.orders.length) {
            vm.isNull = true;
          }
          console.log("团购订单列表数据", rel);
        },
        function(error) {
          console.log(error, "团购数据获取失败");
          showAlert((error.data && error.data.message) || "团购数据获取失败");
        }
      );
    }

    function showAlert(type) {
      var alertPopup = $ionicPopup.alert({
        title: "提示",
        template: type
      });
    }

    function cancelOrder(order) {
      console.log(order);
      var params = {
        tradeNo: order.orderNo
      };
      applyApi.post(
        "order/cancel-groupOrder",
        params,
        function(rel) {
          showAlert("取消订单成功");
          vm.orders = [];
          vm.noMore = true;
          groupOrders();
        },
        function(error) {
          if (error.message) {
            showAlert(error.message);
          } else {
            showAlert("取消订单失败");
          }
        }
      );
    }

    function showAlert(content) {
      var alertPopup = $ionicPopup.alert({
        title: "提示",
        template: content
      });
    }

    function payGroupOrder(order) {
      console.log(order, "支付订单详情");
      $state.go("orderDetai", {
        order: order.orderId
      });
      // 服务器多给我一个普通订单的ID，我根据这个ID跳转到order-detail，然后进行付款
    }

    function detail(order) {
      var params = {
        groupId: order.id
      };
      $state.go("groupShare", params);
    }
  }
})();
