(function () {
  'use strict';

  angular
    .module('util.http', [])
    .factory('httpService', httpService);

  /* @ngInject */
  function httpService($http, $q, $httpParamSerializerJQLike, API_URL, QINIU_HOST, adminService, modalService, Upload) {
    var baseUrl = API_URL;
    var token = adminService.getAdmin().token;
    var service = {
      get: get,
      postForm: postForm,
      postJson: postJson,
      uploadToQiniu: uploadToQiniu
    };
    return service;

    function get(path) {
      var promise = $http({
        method: 'GET',
        url: baseUrl + path,
        headers: {
          'X-Auth-Token': token
        }
      });

      return result(promise);
    }

    function postForm(path, param) {
      var promise = $http({
        method: 'POST',
        url: baseUrl + path,
        headers: {
          'X-Auth-Token': token,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: param,
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj) {
            if (obj[p] !== null) {
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
          }
          return str.join("&");
        }
      });

      return result(promise);
    }

    function postJson(path, param) {
      var promise = $http({
        method: 'POST',
        url: baseUrl + path,
        headers: {
          'X-Auth-Token': token,
          'Content-Type': 'application/json'
        },
        data: param,
        transformRequest: function (obj) {
          return JSON.stringify(obj);
        }
      });

      return result(promise);
    }

    function result(promise) {
      var deferred = $q.defer();

      promise.success(function (response) {
        if (response.code == 200) {
          deferred.resolve(response.data);
        } else {
          deferred.reject(response);

          // modalService.openErrorModal(response);
        }
      }).error(function (response) {
        deferred.reject(response);

        modalService.openErrorModal(response);
      });

      return deferred.promise;
    }

    function uploadToQiniu(file, type) {
      if (type === 'private') {
        return uploadToQiniuPrivate(file);
      }

      return uploadToQiniuPublic(file);
    }

    function uploadToQiniuPublic(file) {
      var deferred = $q.defer();

      // 先获取上传凭证
      get('/admin/qiniu/public-upload-token')
        .then(function (token) {
          return uploadToQiniuByToken(file, token);
        })
        .then(function (data) {
          deferred.resolve(data.data);
        });

      return deferred.promise;
    }

    function uploadToQiniuPrivate(file) {
      var deferred = $q.defer();

      // 先获取上传凭证
      get('/admin/qiniu/private-upload-token')
        .then(function (token) {
          return uploadToQiniuByToken(file, token);
        })
        .then(function (data) {
          deferred.resolve(data.data);
        });

      return deferred.promise;
    }

    function uploadToQiniuByToken(file, token) {
      var payload = new FormData();
      payload.append('token', token);
      payload.append('file', file);
      var extension = file.name.substring(file.name.lastIndexOf('.'));
      var fileName = new Date().getTime().toString() + extension;
      console.log(fileName);
      payload.append('key', fileName);

      var promise = $http({
        url: QINIU_HOST,
        method: 'POST',
        headers: {
          'Content-Type': undefined
        },
        data: payload,
        transformRequest: angular.identity
      });

      return promise;
    }
  }

})();
