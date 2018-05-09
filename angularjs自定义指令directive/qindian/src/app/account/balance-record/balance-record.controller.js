(function () {
  'use strict';

  angular
    .module('starter.account')
    .controller('BananceRecordCtrl', BananceRecordCtrl)

  BananceRecordCtrl.$inject = ['homeService','applyApi','$scope'];

  function BananceRecordCtrl(homeService,applyApi,$scope) {
    var vm = this
    vm.params = {
      page: 0,
      size: 10
    }
    vm.getRecord = []
    vm.loadMore = getRecord;
    vm.noMore = true;

    // getRecord();
    function getRecord() {
      applyApi.post('me/consumption-record', 
        {
          page: ++vm.params.page,
        },
        function (rel) {
          if (
            angular.equals(
              vm.getRecord[vm.getRecord.length - 1],
              rel.data.list[rel.data.list.length - 1]
            )
          ) {
            $scope.$broadcast("scroll.infiniteScrollComplete");
            vm.noMore = false;
          } else {
            vm.getRecord = vm.getRecord.concat(rel.data.list);
            $scope.$broadcast("scroll.infiniteScrollComplete");
          }
          if (vm.getRecord.length === 0) {
            $scope.noMore = false;
          }
        }, function () {
          console.log('food error')
        })
    }
  }

})();