(function() {
    'use strict';

    angular.module('BlurAdmin.service')
        .factory('apiRequest', apiRequest);

    /** @ngInject */
    function apiRequest($http, adminService, API_URL,$q) {
      console.log(API_URL);
      var base_url = API_URL;
        var error = function() {
            //默认错误处理
        }
        var token = adminService.getAdmin().admin.token;
        var apiGet = function(url, params, success, error) {
            $http({
                method: 'GET',
                url: base_url + url,
                headers: {
                    'X-Auth-Token': token
                },
                params: params
            }).then(function(response) {
                console.log("success get");
                if (response.data.code == 200) {
                    success(response.data);
                } else {
                    if (error) {
                        error(response);
                    } else{
                        errorCallBack(response);
                    }
                }

            }, function(response) {
                if (error) {
                    error(response);
                } else{
                    errorCallBack(response);
                }
            });
        };

        var apiPost = function(url, parameters, success, error) {
            // var token = AuthService.getToken();
            $http({
                method: 'POST',
                url: base_url + url,
                headers: {
                    'X-Auth-Token': token
                },
                data: parameters
            }).then(function(response) {
                console.log("success post");
                //console.log(response);
                if (response.data.code == 200) {
                    success(response.data);
                } else {
                    error(response.data);
                }
            }, function(response) {
                console.log("error post");
                if (error) {
                    error(response);
                } else {
                    console.log('默认错误处理');
                }
                console.error("API Error");
            });
        };

        var apiPostJson = function(url, parameters, success, error) {
            // var token = AuthService.getToken();
            $http({
                method: 'POST',
                url: base_url + url,
                headers: {
                    'X-Auth-Token': token,
                    'Content-Type': 'application/json'
                },
                data: parameters,
                transformRequest: function(obj) {
                    return JSON.stringify(obj);
                }
            }).then(function(response) {
                console.log("success post");
                if (response.data.code == 200) {
                    success(response.data);
                } else {
                  // errorCallBack(response.data);
                  error(response.data);
                }
            }, function(response) {
                console.log("error post");
                if (error) {
                    error(response);
                } else {
                    console.log('默认错误处理');
                }
                console.error("API Error");
            });
        };


        return {
            get: apiGet,
            post: apiPost,
            postJson: apiPostJson,
        }

    }
})();
