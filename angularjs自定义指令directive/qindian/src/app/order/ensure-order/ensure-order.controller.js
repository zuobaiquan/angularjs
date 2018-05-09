(function() {
  "use strict";
  angular
    .module("starter.order")
    .controller("EnsureOrderCtrl", EnsureOrderCtrl);

  /** @ngInject */
  function EnsureOrderCtrl(
    $scope,
    ionicDatePicker,
    applyApi,
    $state,
    $filter,
    locationService,
    homeService,
    $ionicPopup,
    $ionicLoading,
    $stateParams,
    $rootScope,
    $window,
    $ionicModal
  ) {
    var vm = this;

    vm.orderInfo = homeService.getOrderInfo();
    $scope.purpose = locationService.getTarget();

    // $scope.details = getOrderDetails();
    $scope.paramsDetail = {};
    $scope.amount = vm.orderInfo.amount;
    $scope.arrivalDate = {};
    $scope.makeOrder = makeOrder;
    // $scope.breakfastPicker = openBreakfastPicker;
    // $scope.lunchPicker = openLunchPicker;
    $scope.openPicker = openPicker;
    $scope.expirePrice = 0;
    $scope.isGroupBuy = {
      text: "是否发起团购",
      check: false
    };
    $scope.groupRole = $stateParams.orderType;
    $scope.agio = 0;
    $scope.chooseCoupon = chooseCoupon;

    var activeType, _types = {};
    var nextDay = new Date();
    var lastDay = new Date();
    // 单独分类下的总金额
    var amounts = {};
    var _originDetails = getOrderDetails();
    $scope.details = angular.copy(_originDetails);

    nextDay.setTime(nextDay.getTime() + 24 * 60 * 60 * 1000);
    // lastDay.setTime(lastDay.getTime() + 24 * 60 * 60 * 1000 * 7);

    $scope.sendTime = {};
    $scope.arrivalDate = {};
    if ($scope.groupRole === "1") {
      $scope.isGroupBuy.check = true;
    }

    /**
     * 检查配送日期是否为节假日
     * 包括周末和法定假日
     * @param {any} date
     * @returns
     */
    function checkWeekend(date) {
      var day = new Date(date).getDay();
      var isHoliday = false,
        holidays = [
          "2017-05-28",
          "2017-05-29",
          "2017-05-30",
          "2017-10-01",
          "2017-10-02",
          "2017-10-03",
          "2017-10-04",
          "2017-10-05",
          "2017-10-06",
          "2017-10-07",
          "2017-10-08"
        ],
        adjust = ["2017-05-27", "2017-09-30"],
        fullDay = $filter("date")(new Date(date), "yyyy-MM-dd");
      // 是否是假期
      for (var index = 0; index < holidays.length; index++) {
        var holiday = holidays[index];
        if (fullDay === holiday) {
          isHoliday = true;
          return isHoliday;
        }
      }
      if (day === 6 || day === 0) {
        if (fullDay === adjust[0] || fullDay === adjust[1]) {
          isHoliday = false;
          return isHoliday;
        }
        isHoliday = true;
      }
      return isHoliday;
    }

    checkBindPhone();
    // checkActiveCoupon();
    foodTypes();

    var pickerConfig = {
      callback: function(val) {
        // 显示的
        $scope.sendTime[activeType] = $filter("date")(
          new Date(val),
          "yyyy/MM/dd"
        );
        // 传递的
        $scope.arrivalDate[activeType] = $filter("date")(
          new Date(val),
          "yyyy-MM-dd"
        );
        // if (checkWeekend(val)) {
        //   showAlert("节假日无法配送，请重新选择配送时间");
        //   return;
        // }
        isExpire(new Date(val));
      },
      from: nextDay,
      inputDate: nextDay
    };

    function openPicker(type) {
      activeType = type;
      ionicDatePicker.openDatePicker(pickerConfig);
    }

    /**
     * 将购物车中的foods进行处理
     * 便于在前台进行渲染
     * @param {any} params
     * @returns
     */
    function getOrderDetails(params) {
      // 用户向接口传递数据
      var detail = {};
      $scope.demoDetail = {};
      $scope.demoParamsDetail = {};
      var foods = homeService.getOrderInfo().foods;
      angular.forEach(foods, function(value, index) {
        // debugger
        if (!_types[value.type]) {
          _types[value.type] = value.type;
          detail[value.type] = [];
          amounts[value.type] = 0;
        }
        detail[value.type].push(value);
        amounts[value.type] += value.singlePrice * value.amount;
        // if (value.type === 1) {
        //   detail.breakFast.push(value);
        // } else {
        //   detail.lunch.push(value);
        // }
        $scope.agio += (value.original - value.singlePrice) * value.amount;
      });
      // console.log($scope.demoDetail, 'demo Detail');
      return detail;
    }

    /**
     * 生成订单
     *
     * @returns
     */
    function makeOrder() {
      var params = {},
        orders = [],
        cupboardId = $scope.purpose.id,
        tempOrder,
        isIllegal = false,
        postUrl = "order/make-order";

      if ($scope.amount - $scope.expirePrice <= 0) {
        showAlert("有效期范围内的餐品才能进行付款");
        return;
      }

      if (angular.equals($scope.paramsDetail, {})) {
        showAlert("请选择配送日期");
        return;
      }
      // 拆单
      // 拆单的同时检测是否使用了优惠券
      angular.forEach($scope.paramsDetail, function(value, key) {
        tempOrder = {
          arrivalDate: $scope.arrivalDate[key],
          cupboardId: cupboardId,
          details: value
        };
        if ($scope.activeCoupon && $scope.activeCoupon[key]) {
          tempOrder.couponRecordId = $scope.activeCoupon[key].id;
        }
        if (value.length) {
          orders.push(tempOrder);
        }
      });
      params.cupboardId = cupboardId;
      // 团购订单改变拼接postUrl
      if ($scope.isGroupBuy.check || $scope.groupRole === "1") {
        // $stateParams.orderType 0-团购发起人；1-团购参与者
        postUrl = "order/teambuy?orderType=" + $scope.groupRole;
        if ($scope.groupRole === "1") {
          postUrl += "&groupId=" + $rootScope.groupId;
        }
        // $state.go('groupShare');
      }

      if (!isIllegal) {
        isMakingOrder();
        console.log(JSON.stringify(orders), "make-order");
        applyApi.postJson(
          postUrl,
          orders,
          function(rel) {
            console.log("生成订单返回数据", rel);
            makeOrderEnd();
            // 团购订单保存团购ID
            if (rel.data.groupUrl) {
              $rootScope.groupUrl = rel.data.groupUrl;
              $rootScope.groupId =
                rel.data.groupUrl && rel.data.groupUrl.split("/").slice(-1)[0];
            }
            $window.sessionStorage.setItem("groupID", $rootScope.groupId);
            $state.go("payOrder", {
              data: $scope.isGroupBuy.check ?
                JSON.stringify(rel.data.payRecord) :
                JSON.stringify(rel.data),
              // 0 团购付款 1 非团购付款
              isGroup: $scope.isGroupBuy.check ? 0 : 1
            });
          },
          function(error) {
            console.log(error, "生成订单失败");
            showAlert((error.data && error.data.message) || "订单生成失败，请稍后再试");
            makeOrderEnd();
          }
        );
      }
    }

    /**
     * 获取用户信息，判断是否已经绑定了手机
     *
     */
    function checkBindPhone() {
      isMakingOrder();
      applyApi.post(
        "me/info", {},
        function(rel) {
          $scope.phone = rel.data.account.phone;
          makeOrderEnd();
          if ($scope.phone === null || $scope.phone === "") {
            showConfirm("下单之前需先绑定手机");
          }
        },
        function() {
          console.log("获取用户信息失败");
        }
      );
    }

    function showAlert(type) {
      var alertPopup = $ionicPopup.alert({
        title: "提示",
        template: type
      });
    }

    /**
     * 判断订单列表中是否存在超出有效期的菜品
     *
     * @param {Date} selectDate
     */
    function isExpire(selectDate) {
      var foodTypes = {},
        demoProcessResult;
      $scope.expirePrice = 0;
      angular.forEach(_types, function(value, index) {
        foodTypes[value] = angular.copy(_originDetails[value]);
        demoProcessResult = processExpire(selectDate, foodTypes[value]);
        $scope.paramsDetail[value] = demoProcessResult.params;
        $scope.details[value] = demoProcessResult.show;
      });
      console.log("处理完成后的details", $scope.details);
      console.log("处理完成后的paramsDetails", $scope.paramsDetail);
    }

    /**
     * 对过期餐品进行处理
     *
     * @param {Data} selectDate
     * @param {Array} foodList
     * @returns 对象，show表示页面显示的数据，params表示同后台通信传递的数据
     */
    function processExpire(selectDate, foodList) {
      var showData = [],
        paramsData = [];
      var startExpiryData, endExpiryData;
      angular.forEach(foodList, function(value, index) {
        startExpiryData = new Date(value.startDate.replace(/-/g, "/"));
        endExpiryData = new Date(value.endDate.replace(/-/g, "/"));
        if (selectDate > endExpiryData || selectDate < startExpiryData) {
          console.log("超出有效日期餐品", value);
          // 价格置为空
          $scope.expirePrice += value.singlePrice * value.amount;
          value.singlePrice = null;
        } else {
          paramsData.push(value);
        }
        showData.push(value);
      });
      return {
        show: showData,
        params: paramsData
      };
    }

    function isMakingOrder() {
      $ionicLoading.show({
        template: "请稍后"
      });
    }

    function makeOrderEnd() {
      $ionicLoading.hide();
    }

    // 一个确认对话框
    function showConfirm(tip) {
      var confirmPopup = $ionicPopup.confirm({
        title: "提示",
        template: tip,
        buttons: [{
          text: "绑定",
          type: "button-positive",
          onTap: function(e) {
            // makeOrderEnd();
            $state.go("edittel");
          }
        }, {
          text: "取消",
          onTap: function(e) {
            // makeOrderEnd();
            $state.go("home");
          }
        }]
      });
    }

    /**
     * 检查订单中的优惠券信息
     *
     */
    function checkActiveCoupon() {
      $scope.activeCoupon = homeService.getCoupon();
      $scope.discountAmount = 0;
      angular.forEach($scope.activeCoupon, function(value, index) {
        console.log(value, "红包");
        $scope.discountAmount += (value && value.amount) || 0;
      });
      console.log($scope.activeCoupon, "确认订单中接收到的优惠券信息");
    }

    $scope.$watch("isGroupBuy.check", function(newValue, oldValue) {
      if (newValue) {
        $scope.discountAmount = 0;
        $scope.activeCoupon = void 0;
      }
    });

    function foodTypes() {
      applyApi.post(
        "type-food/selectFoodType", {},
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

    $ionicModal
      .fromTemplateUrl("app/account/coupon/coupon-modal.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal = modal;
      });

    function chooseCoupon(key) {
      $scope.key = key;
      getCoupons();
    }

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    function getCoupons() {
      applyApi.post(
        "coupon/list", {
          // 0表示查询有效的优惠券
          status: 0
        },
        function(rel) {
          console.log("%c获取优惠券列表成功", "color:green;");
          $scope.coupons = rel.data;
          $scope.modal.show();
        },
        function(reason) {
          console.log("%c获取优惠券列表错误", "font-size:20px;color:red;");
        }
      );
    }

    /**
     * 红包Modal中的选择红包evt
     *
     * @param {any} coupon
     * @returns
     */
    $scope.modalActiveCoupon = function(coupon) {
      if (!$scope.key) {
        return;
      }
      console.log("选择优惠券");
      var orderAmount = amounts[$scope.key];
      if (orderAmount < coupon.conditions) {
        showAlert("金额为¥ " + orderAmount + " 不满足优惠券使用要求,请重新选择");
        return;
      }
      var usedCoupon = homeService.setCoupon($scope.key, coupon);
      //   if (usedCoupon && usedCoupon !== 'no type') {
      //     showAlert("此优惠券在其他餐种中已使用，请重新选择。");
      //   }else{
      //     checkActiveCoupon();
      //     $scope.closeModal();
      //   }
      checkActiveCoupon();
      $scope.closeModal();
    };

    $scope.cancelCoupon = function() {
      homeService.removeCoupon($scope.key)
      checkActiveCoupon();
      $scope.closeModal();
    }

    $scope.$on('$destroy', function() {
      console.log('$destroy');
      $scope.modal&&$scope.modal.remove();
    });
  }
})();
