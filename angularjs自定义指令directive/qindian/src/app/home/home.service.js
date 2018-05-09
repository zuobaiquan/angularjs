(function() {
  "use strict";
  angular.module("starter.home").factory("homeService", homeService);

  /** @ngInject */
  function homeService($q, locationService, applyApi) {
    var foods,
      oldBoard,
      order = {
        foods: [],
        amount: 0
      },
      banners,
      activeCategory = {
        data: null,
        ele: null
      },
      activeCoupon = {};

    var service = {
      getFoods: getFoods,
      addToShopcart: addToShopcart,
      getOrderInfo: getOrdersFood,
      clearCart: clearCart,
      getBanners: getBanners,
      setActiveCategory: setActiveCategory,
      getActiveCategory: getActiveCategory,
      setActiveElement: setActiveElement,
      getMerchantCoupon: getMerchantCoupon,
      getCoupon: getCoupon,
      setCoupon: setCoupon,
      removeCoupon: removeCoupon
    };
    return service;

    /**
     * 从服务器获取餐品数据
     *
     * @param {object} cupboardId
     * @returns 餐品列表数据
     */
    function getFoods() {
      var deferred = $q.defer(), locationData = {};

      locationData = locationService.getTarget();
      if (foods && angular.equals(oldBoard, locationData)) {
        deferred.resolve(foods);
      } else {
        banners = null;
        oldBoard = angular.copy(locationData);
        applyApi.post(
          "food/list",
          {
            cupboardId: locationData.id
          },
          function(rel) {
            foods = rel.data;
            deferred.resolve(rel.data);
          },
          function(reason) {
            console.log("food error");
            deferred.reject(reason);
          }
        );
      }
      return deferred.promise;
    }

    function addToShopcart(type, food) {
      // food.id 为home-con中的id，food.foodId为购物车中商品的id
      var foodParams = {
        amount: 1,
        foodId: food.id || food.foodId,
        name: food.name,
        singlePrice: food.price || food.singlePrice,
        original: food.originalPrice,
        type: food.type,
        startDate: food.startDate,
        endDate: food.endDate
      };
      // 是否已有菜品的标识
      var flag = true;
      // debugger
      if (order.foods.length === 0) {
        order.foods.push(foodParams);
      } else {
        angular.forEach(order.foods, function(value, index) {
          if (value.foodId === foodParams.foodId) {
            flag = false;
            value.amount = type === "add" ? value.amount + 1 : value.amount - 1;
            if (value.amount === 0) {
              order.foods.splice(index, 1);
            }
            return;
          }
        });
        if (flag) {
          order.foods.push(foodParams);
        }
      }
      // 计算总额
      order.amount = type === "add"
        ? order.amount + foodParams.singlePrice
        : order.amount - foodParams.singlePrice;
    }

    function getOrdersFood() {
      return order;
    }

    function clearCart() {
      order = {
        foods: [],
        amount: 0
      };
    }

    function getBanners() {
      var deferred = $q.defer(), locationData = {};
      if (banners) {
        deferred.resolve(banners);
      } else {
        locationData = locationService.getTarget();
        applyApi.post(
          "banner/list",
          {
            cupboardId: locationData.id
          },
          function(rel) {
            banners = rel.data;
            console.log("banner 信息", rel);
            deferred.resolve(rel.data);
          },
          function(reason) {
            console.log("food error");
            deferred.reject(reason);
          }
        );
      }
      return deferred.promise;
    }

    function setActiveCategory(data) {
      activeCategory.data = data;
    }

    function setActiveElement(data) {
      activeCategory.ele = data;
    }

    function getActiveCategory() {
      return activeCategory;
    }

    function getMerchantCoupon(id) {
      var deferred = $q.defer();
      applyApi.post(
        "coupon/merchant-coupon",
        {
          merchantId: id
        },
        function(rel) {
          console.log("%c获取商家优惠券成功", "color:green;");
          deferred.resolve(rel.data);
        },
        function(reason) {
          console.log("%c获取商家优惠券信息错误", "font-size:20px;color:red;");
          deferred.reject(reason);
        }
      );
      return deferred.promise;
    }

    function setCoupon(type, coupon) {
        console.log('coupon type',type,coupon);
      var isUsed = false;
      angular.forEach(activeCoupon, function(value) {
        if (value.id === coupon.id) {
          isUsed = true;
          return isUsed;
        }
      });
      if (type) {
        activeCoupon[type] = coupon;
        return isUsed;
      }
      return "no type";
    }

    function getCoupon() {
      return activeCoupon;
    }

    function removeCoupon(type) {
      delete activeCoupon[type];
    }
  }
})();
