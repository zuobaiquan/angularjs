(function () {
  'use strict';
  angular
    .module('starter.home')
    .controller('HomeConCtrl', HomeConCtrl);

  /** @ngInject */
  function HomeConCtrl($scope, $ionicPopup, homeService, $timeout, $ionicModal, $window) {
    var vm = this
    $scope.categoryIndex = 0;
    $scope.activeCategory = homeService.getActiveCategory();
    $scope.activeFood = null;
    $scope.positionToFood = positionToFood;
    $scope.toggle = toggle;

    if ($scope.activeCategory.data && $scope.activeCategory.ele) {
      $scope.activeCategory.data = null
      $scope.activeCategory.ele = null
    }
    console.log($scope.activeCategory, '进入home后获取的当前分类');
    $scope.activeCategories = function (event, categoryInfo) {
      homeService.setActiveCategory(categoryInfo)
      // debugger
      if (!$scope.activeCategory.ele) {
        $scope.activeCategory.ele = angular.element(document.getElementsByClassName('item-active')[0]);
      }
      if (event.target) {
        $scope.categoryIndex = event.target.parentElement.getAttribute('data-categoryID');
        $scope.activeCategory.ele.removeClass('item-active')
        $scope.activeCategory.ele = angular.element(event.target.parentElement);
      } else {
        $scope.categoryIndex = event.attr('ata-categoryID');
        $scope.activeCategory.ele.removeClass('item-active')
        $scope.activeCategory.ele = event
      }
      $scope.activeCategory.ele.addClass('item-active')
    };

    function positionToFood(params) {
      if (params.type === 1) {
        console.log('外部链接');
        $window.location.href = params.outerurl;
        return
      }
      var domSelector = "ion-item[data-bannersecondid='" + params.secondLevelId + "']",
        contactDom;
      contactDom = angular.element(document.querySelector(domSelector))
      var subCategory = contactDom.attr('data-subCategory');
      $scope.activeCategories(contactDom, JSON.parse(subCategory))
    }

    $scope.openParticular = function (food) {
      $scope.activeFood = food;
      $scope.modal.show();
    };

    $ionicModal.fromTemplateUrl('app/home/home-particular/home-particular.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.closeParticular = function () {
      $scope.modal.hide();
    };

    function _expand(event) {
      event.addClass('ba-sidebar-item-expanded');
    }

    function _collapse(event) {
      event.removeClass('ba-sidebar-item-expanded');
    }

    function toggle(event) {
      event.stopPropagation();
      var tag = angular.element(event.target.parentElement);
      angular.element(tag).hasClass('ba-sidebar-item-expanded') ? _collapse(tag) : _expand(tag);
    }

  }
})();
