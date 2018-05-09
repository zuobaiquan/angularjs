(function () {
  'use strict';

  angular
    .module('starter.location')
    .factory('locationService', locationService)

  /** @ngInject */
  function locationService(applyApi, $q, $window) {
    var cupboards = [],
      targetBoard = {},
      userLocation = {}

    var service = {
      getCupboards: getCupboards,
      getTarget: getTarget,
      setTarget: setTarget,
      setLocation: setLocation,
      getLocation: getLocation
    }

    return service

    /**
     * 返回当前位置下柜子列表
     * 
     * @param {Object} 经纬度 
     * @returns 
     */
    function getCupboards(locationParam) {
      var deferred = $q.defer();
      var tempTarget = $window.localStorage.getItem('qd-location-history');
      if (cupboards.length !== 0) {
        deferred.resolve(cupboards);
      } else {
        applyApi.post('cupboard/list', locationParam,
          function (rel) {
            cupboards = rel.data;
            // 默认距离最近的为目标快递柜
            targetBoard = (tempTarget && JSON.parse(tempTarget)[JSON.parse(tempTarget).length - 1]) || cupboards[0];
            deferred.resolve(rel.data);
          },
          function (reason) {
            deferred.reject(reason);
          });
      }
      return deferred.promise;
    }

    /**
     * 返回目标收货的柜子
     * 
     * @param {any} locationParam 
     * @returns 
     */
    function getTarget() {
      if (typeof targetBoard === 'string') {
        targetBoard = JSON.parse(targetBoard);
      }
      return targetBoard;
    }

    /**
     * 设置收货柜子
     * 
     * @param {any} cupboard 
     */
    function setTarget(cupboard) {
      // debugger
      if (angular.equals(cupboard, targetBoard)) {
        return
      }
      targetBoard = cupboard
    }

    function setLocation(location) {
      userLocation  = location;
    }

    function getLocation() {
      return userLocation;
    }
  }
})();
