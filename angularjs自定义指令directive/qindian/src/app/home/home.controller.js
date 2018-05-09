(function() {
  "use strict";
  angular.module("starter.home").controller("HomeCtrl", HomeCtrl);

  /** @ngInject */
  function HomeCtrl(
    homeService,
    locationService,
    $timeout,
    $ionicSlideBoxDelegate,
    AuthService,
    $ionicPopup,
    QINIU_LINK,
    $window,
    $scope,
    $ionicModal,
    $http,
    $state,
    GDAPI_TOKEN,
    APP
  ) {
    var vm = this;
    vm.QINIU_LINK = QINIU_LINK;
    // ===== start =====
    vm.count = {};
    vm.sumCount = 0;
    vm.changeArticleCount = changeArticleCount;
    vm.positionToFood = positionToFood;
    vm.clearCart = clear;
    vm.banners = [];
    vm.loadState = {
      isLoading: true,
      isError: false
    };
    vm.orderInfo = homeService.getOrderInfo();
    vm.locationData = {
      latitude: 31.25,
      longitude: 120.73
    };
    vm.showPopup = showPopup;
    vm.isShowCart = false;
    $scope.choosePoi = choosePoi;
    var token = GDAPI_TOKEN;
    if (!APP.devMode) {
      AuthService.getWxLocation(function (res) {
      vm.locationData.latitude = res.latitude;
      vm.locationData.longitude = res.longitude;
        nearbyInfo();
      },function (res) {
        nearbyInfo();
      });
    } else {
      nearbyInfo();
    }
    recoveryCounts();
    /**
     * 菜品增加减少按钮event
     *
     * @param {String} type 增加或减少
     * @param {Object} food 菜品
     */
    function changeArticleCount(type, food) {
      homeService.addToShopcart(type, food);
      var foodId = food.id || food.foodId;
      if (type === "add") {
        // 单一商品数量增加
        vm.count[foodId] = vm.count[foodId] + 1 || 1;
        // 总商品数量增加
        vm.sumCount += 1;
      } else {
        vm.count[foodId] = vm.count[foodId] - 1;
        vm.sumCount -= 1;
      }
    }

    /**
     * 从其他state回到home时
     * 恢复购物车中的数据
     */
    function recoveryCounts() {
      angular.forEach(vm.orderInfo.foods, function(value, index) {
        vm.count[value.foodId + ""] = value.amount;
        vm.sumCount += value.amount;
      });
    }

    /**
     * Banner点击事件响应
     * 跳转外部链接或是定位到二级分类
     * @param {any} params
     */
    function positionToFood(params) {
      if (params.type === 1) {
        console.log('外部链接');
        return
      }
      var domSelector =
        'ion-item[data-bannersecondid="' + params.secondLevelId + '"',
        contactDom;
      contactDom = angular.element(document.querySelector(domSelector));
      var scope = contactDom.scope();
      contactDom.triggerHandler("click");
    }

    function showPopup() {
      vm.isShowCart = !vm.isShowCart;
    }

    // A confirm dialog
    function clear() {
      var confirmPopup = $ionicPopup.confirm({
        title: "提示",
        template: "是否清空购物车?",
        buttons: [
          {
            text: "取消"
          },
          {
            text: "确认",
            type: "button-positive",
            onTap: function(e) {
              homeService.clearCart();
              vm.orderInfo = homeService.getOrderInfo();
              vm.sumCount = 0;
              vm.count = {};
            }
          }
        ]
      });
    }

    /**
     * 首页获取商家发放的红包
     */
    function merchantCoupon() {
      homeService.getMerchantCoupon(vm.cupboard.merchantId).then(function(res) {
        if (res.length !== 0) {
          console.log(res, "商家红包列表");
          // 超过三个红包不予显示但不妨碍领取
          $scope.coupons = res.slice(0, 3);
          $scope.type = "merchant";
          couponObtain();
        }
      });
    }

    $scope.$on("$destroy", function() {
      $scope.modal && $scope.modal.remove();
      $scope.locationModal && $scope.locationModal.remove();
    });
    $scope.closeModal = function() {
      $scope.modal && $scope.modal.hide();
    };
    $scope.closeLocationModal = function() {
      if (!vm.activePoi) {
        vm.activePoi = $scope.nearbys[0];
      }
      $scope.locationModal && $scope.locationModal.hide();
      // 选择柜子
      locationService.setLocation(vm.activePoi);
      chooseBoard(vm.activePoi);
    };

    /**
     * 商家红包Modal
     */
    function couponObtain() {
      !$scope.modal && $ionicModal
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
     * 弹出地址选择框Modal
     * @returns
     */
    function locationModal() {
      var defaultPoi = $window.localStorage.getItem("default-poi");
      vm.cupboard = locationService.getTarget();

      if (defaultPoi) {
        vm.activePoi = JSON.parse(defaultPoi);
        var location = vm.activePoi.location.split(","),
          params = {
            latitude: location[1],
            longitude: location[0]
          };
        locationService.getCupboards(params).then(function(response) {
          vm.cupboard = locationService.getTarget();
          merchantCoupon();
          foods();
          banners();
        });
        return;
      }
      if (!angular.equals(vm.cupboard, {})) {
        vm.activePoi = locationService.getLocation();
        console.log(vm.activePoi);
        merchantCoupon();
        foods();
        banners();
        return;
      }
      if (!$scope.locationModal) {
        $ionicModal
          .fromTemplateUrl("app/home/locationModal/locationModal.html", {
            scope: $scope,
            animation: "slide-in-up"
          })
          .then(function(modal) {
            $scope.locationModal = modal;
            $scope.locationModal.show();
          });
      }

    }

    /**
     * 通过高德API查询附近的商务写字楼
     * 查询完成后弹出Modal供用户选择
     */
    function nearbyInfo() {
      console.log('nearbayinfo');
      $http({
        method: "GET",
        url: "http://restapi.amap.com/v3/place/around?key="+token+"&location=" +
          vm.locationData.latitude +
          "," +
          vm.locationData.longitude +
          "&output=json&radius=10000&types=商务写字楼&offset=3"
      }).then(function successCallback(response) {
        $scope.nearbys = response.data.pois;
        locationModal();
        console.log("当前地址附近列表", $scope.nearbys);
      });
    }

    /**
     * $scope.locationModal中
     * 选择附近写字楼func
     * @param {any} poi
     */
    function choosePoi(poi) {
      vm.activePoi = poi;
      console.log(vm.isRemember, "记住");
      if (vm.isRemember) {
        $window.localStorage.setItem("default-poi", JSON.stringify(poi));
      }
      $scope.closeLocationModal();
    }

    /**
     * 选择附近写字楼后
     * 选择写字楼附近柜子
     * @param {any} poi
     */
    function chooseBoard(poi) {
      console.log(poi, "选择的地址信息");
      var location = poi.location.split(","),
        params = {
          latitude: location[1],
          longitude: location[0]
        };
      locationService
        .getCupboards(params)
        .then(function(response) {
          $state.go("locationKdg");
          console.log(response, "选择附近地址后获取附近柜子信息");
        })
        .catch(function(error) {
          console.error(error, "获取柜子信息失败");
        });
    }

    /**
     * 获取当前柜子下的菜品
     * @param {any} params
     */
    function foods(params) {
      homeService
        .getFoods()
        .then(function(data) {
          vm.foods = data;
          console.log("获取餐品列表成功");
          console.log(data);
          setDefaultActiveCategory(data[0].children[0]);
          vm.loadState.isLoading = false;
        })
        .catch(function() {
          vm.loadState.isError = true;
          console.log("获取餐品列表失败");
        });
    }

    /**
     * 获取Banner
     */
    function banners() {
      homeService
        .getBanners()
        .then(function(data) {
          vm.banners = data;
          $ionicSlideBoxDelegate.update();
          console.log("轮播页列表成功");
        })
        .catch(function(reason) {
          console.log("获取轮播页列表失败", reason);
        });
    }

    /**
     * 设置默认选中的菜品分类
     * @param {any} data
     */
    function setDefaultActiveCategory(data) {
      homeService.setActiveCategory(data)
    }
  }
})();
