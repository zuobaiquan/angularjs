(function() {
  "use strict";
  angular
    .module("starter.groupShare", [])
    .controller("groupShareCtrl", groupShareCtrl);

  /** @ngInject */
  function groupShareCtrl(
    homeService,
    $state,
    locationService,
    AuthService,
    APP,
    $rootScope,
    ServerConfiguration,
    $stateParams,
    applyApi,
    QINIU_LINK,
    verify,
    $window,
    $ionicModal,
    $scope
  ) {
    var vm = this;
    vm.hasMore = false;
    vm.join = joinGroupBuy;
    vm.QINIU_LINK = QINIU_LINK;
    vm.promptShare = promptShare;
    vm.openParticular = openParticular;
    init();

    function init() {
      getDetail();
      vm.joinBtn = $stateParams.userId === "isMakeGroup" ? false : true;
      if ($stateParams.groupId) {
        $rootScope.groupId = $stateParams.groupId;
      }
      if ($rootScope.groupId) {
        AuthService.showShareMenuItems();
        if (!APP.devMode) {
          var shareData = {
            title: "我和你不止是工作关系",
            desc: "我开的团一定要参加",
            imgUrl: "http://ooadwu9pq.bkt.clouddn.com/FksRKBb1BWBPY_Gi_YIcA0UbCp9G",
            link: ServerConfiguration.domain +
              ServerConfiguration.webRoot +
              "#/group-share/1/1/" +
              $stateParams.groupId
            // $rootScope.groupUrl.split("#")[1]
          };
          AuthService.setShareConfig(shareData, null);
        }
      }
    }
    /**
     * 计算要显示的头像数量
     * 
     */
    function calcHeades() {
      var screenWidth = window.screen.width;
      var leftMargin = 10, headerSize = 46;
      var count = (screenWidth - leftMargin) / headerSize,
        showCount = count * 2 - 2;
      vm.actor.splice(showCount, vm.actor.length);
      if (count * 2 <= vm.actor.length) {
        vm.hasMore = true;
      }
      if (vm.actor.length > count) {
        vm.justity = true;
      }
    }

    /**
     * 参与团购，进入ensure-order
     * 
     * @returns 
     */
    function joinGroupBuy() {
      console.log("%c团购参加", "color:green;");
      // 根据团购ID拿到菜品、柜子等下单所必需的信息。
      // 模拟用户下单进行处理／配送时间由用户进行选择
      var status = { orderType: 1 };
      var activeCupboard;
      if (vm.cupboardList.length === 1) {
        activeCupboard = vm.cupboardList[0];
      } else if (!vm.activeCupboard && vm.cupboardList.length > 1) {
        couponObtain();
        console.log("商家存在多个绑定的柜子需要进行选择");
        return;
      }
      // 模拟用户选择柜子
      locationService.setTarget(activeCupboard || vm.activeCupboard);
      homeService.setActiveCategory(activeCupboard || vm.activeCupboard);
      // 模拟用户添加商品至购物车
      vm.groupFoods.forEach(function(food) {
        homeService.addToShopcart("add", food);
      }, this);
      // status为1表示团购参与者
      $state.go("ensureOrder", status);
    }

    /**
     * 获取团购订单详情
     */
    function getDetail() {
      var groupId;
      if ($stateParams.groupId) {
        groupId = $stateParams.groupId;
      } else {
        groupId =
          $window.sessionStorage.getItem("groupID") || $rootScope.groupId;
      }
      if (groupId) {
        $rootScope.groupId = groupId;
      }
      isJoinGroup(groupId);
      applyApi.post(
        "group/groupDetail",
        { groupId: groupId },
        function(rel) {
          vm.response = rel.data;
          vm.groupInfo = rel.data.group;
          vm.groupFoods = rel.data.foodList;
          vm.actor = rel.data.accountList;
          vm.joinUsers = vm.actor.length;
          vm.discount = calcDiscount(vm.joinUsers);
          vm.cupboardList = rel.data.cupboardList;
          vm.endTime = vm.groupInfo.endTime.slice(0, 3).join("/") + " 22:00";
          calcHeades();
        },
        function(error) {
          console.error("团购分享详细数据获取失败");
        }
      );
    }

    /**
     * 判断当前用户是否有权限参与团购
     * 根据vm.isJoin对页面进行不同的渲染
     * @param {any} id 团购ID
     */
    function isJoinGroup(id) {
      applyApi.post(
        "group/isJoinGroup",
        { groupId: id },
        function(rel) {
          console.log(rel, "判断用户是否有参与团购的资格");
          vm.isJoin = rel.data === 1 ? false : true;
        },
        function(error) {
          console.error(error, "查询参与团购资格失败");
        }
      );
    }

    function calcDiscount(count) {
      var discount = 10;
      if (count > 1 && count < 6) {
        discount = 9;
      } else if (count > 5) {
        discount = 8;
      }
      return discount;
    }

    function promptShare() {
      verify.tooltip("右上角分享，邀请朋友来参团");
    }

    function openParticular(food) {
      $scope.activeFood = food;
      $scope.noBtn = true;
      $scope.modal.show();
    }

    $ionicModal
      .fromTemplateUrl("app/home/home-particular/home-particular.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal = modal;
      });

    $scope.closeParticular = function() {
      $scope.modal.hide();
    };
    $scope.closeCupboard = function() {
      $scope.boardModal.hide();
    };
    $scope.$on("$destroy", function() {
      $scope.modal && $scope.modal.remove();
      $scope.boardModal && $scope.boardModal.remove();
    });

    /**
     * 用户选择商家下的多个送餐柜
     * 
     */
    function couponObtain() {
      $scope.cupboardList = vm.cupboardList;
      // !$scope.boardModal &&
        $ionicModal
          .fromTemplateUrl("app/group-buy/share/widget/cupboard-modal.html", {
            scope: $scope,
            animation: "slide-in-up"
          })
          .then(function(modal) {
            $scope.boardModal = modal;
            $scope.boardModal.show();
          });
    }

    /**
     * $scope.boardModal
     * 中的选择送餐柜
     * @param {any} board 
     */
    $scope.chooseBoard = function(board) {
      vm.activeCupboard = board;
      $scope.closeCupboard();
      joinGroupBuy();
    };
  }
})();
