(function() {
  "use strict";
  angular.module("starter.order").controller("MyOrderCtrl", MyOrderCtrl);

  MyOrderCtrl.$inject = ["$scope", "applyApi", "$state"];

  function MyOrderCtrl($scope, applyApi, $state, $rootScope) {
    var vm = this;

    $scope.orders = [];
    $scope.forDetail = orderDetail;
    $scope.isNull = false;
    $scope.page = 0;
    $scope.noMore = true;

    $scope.loadMore = getOrders;
    $scope.changeState = changeState;

    function getOrders() {
      applyApi.post(
        "order/list",
        {
          page: ++$scope.page,
          status: $scope.activeStatus || 0
        },
        function(rel) {
          if (
            angular.equals(
              $scope.orders[$scope.orders.length - 1],
              rel.data.list[rel.data.list.length - 1]
            )
          ) {
            $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.noMore = false;
          } else {
            $scope.orders = $scope.orders.concat(rel.data.list);
            $scope.$broadcast("scroll.infiniteScrollComplete");
          }
          if ($scope.orders.length === 0) {
            $scope.isNull = true;
            $scope.noMore = false;
          }
        },
        function() {
          console.log("food error");
        }
      );
    }

    function orderDetail(order) {
      $state.go("orderDetai", {
        order: order.id
      });
    }

    function changeState(evt, index) {
      var activeEle = angular.element(
        document.querySelector(".state--item.state__active")
      );
      if (!angular.equals(activeEle[0], evt.target)) {
        $scope.orders = [];
        $scope.noMore = true;
        $scope.isNull = false;
        $scope.page = 0;
        $scope.activeStatus = index;
        getOrders();
      }
      activeEle.removeClass("state__active");
      angular.element(evt.target).addClass("state__active");
    }
  }
})();
