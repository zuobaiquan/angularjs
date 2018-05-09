angular.module('starter.services')
    .factory('applyApi', ['$http', '$rootScope', 'ServerConfiguration', 'AuthService', 'verify', '$window', '$state', '$ionicHistory',

        function($http, $rootScope, ServerConfiguration, AuthService, verify, $window, $state, $ionicHistory) {

            var base_url = ServerConfiguration.baseApiUrl;
            var errorCallBack = function(error) {
                switch (error.data.code) {
                    case 403:
                        verify.tooltip('被禁止的请求');
                        break;
                    case 401:
                        verify.tooltip('未授权');
                        break;
                    default:
                        verify.tooltip(error.data.message);
                        break;
                }
            };
            var apiGet = function(url, params, success, error) {
                $http({
                    method: 'GET',
                    url: base_url + url,
                    headers: {
                        'Device':'web',
                        'X-Auth-Token': AuthService.getToken() || undefined
                    },
                    params: params
                }).then(function(response) {
                    console.log("success get");
                    if (response.data.code == 200) {
                        success(response.data);
                    } else {
                        console.log('api error');
                        console.log(response);
                        if (error) {
                            error(response);
                        } else
                            errorCallBack(response);
                    }

                }, function(response) {
                    console.log("error get");
                    console.error("API Error");
                    if (error) {
                        error(response);
                    } else {
                        console.log('默认错误处理');
                    }
                });
            };

            var apiPost = function(url, parameters, success, error) {
                $http({
                    method: 'POST',
                    url: base_url + url,
                    headers: {
                        'X-Auth-Token': AuthService.getToken() || 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6IlVTRVIiLCJzdWIiOiJvQ0RndHdHMGJTanRadUlvN3RaQzQxT0x1VkcwIiwiaXNzIjoib0NEZ3R3RzBiU2p0WnVJbzd0WkM0MU9MdVZHMCIsImlhdCI6MH0.-nwJKLj0BNOSncrHZxbIq_G92WFntGwRnmIycjrQxltr3Ek_k5u616ZdArYCJ1Q1Ab-ZXwVQJzw_zhvj-LeQdA' ,
                        'Device':'web'
                    },
                    data: parameters
                }).then(function(response) {
                    console.log("success post");
                    if (response.data.code == 200) {
                        success(response.data);
                    } else {
                        console.log('api error');
                        console.log(response);
                        if (error) {
                            error(response);
                        } else
                            errorCallBack(response);

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
                $http({
                    method: 'POST',
                    url: base_url + url,
                    headers: {
                        'X-Auth-Token': AuthService.getToken() || 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6IlVTRVIiLCJzdWIiOiJvQ0RndHdHMGJTanRadUlvN3RaQzQxT0x1VkcwIiwiaXNzIjoib0NEZ3R3RzBiU2p0WnVJbzd0WkM0MU9MdVZHMCIsImlhdCI6MH0.-nwJKLj0BNOSncrHZxbIq_G92WFntGwRnmIycjrQxltr3Ek_k5u616ZdArYCJ1Q1Ab-ZXwVQJzw_zhvj-LeQdA',
                        'Content-Type': 'application/json',
                        'Device':'web'
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
                        console.log('api error');
                        if (error) {
                            error(response);
                        } else
                            errorCallBack(response);

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

            // var userInfo=false;
            var getUserInfo = function(isRefush, success, error) {
                var inSuccess = function(res) {
                    console.log('info');
                    console.log(res);
                    if (!res.data) {
                    	/* 伪造用户信息 */
                        var visitor = {
                            nickname: '游客',
                            avatar: 'img/visitor.png',
                            type: 0
                        }
                        $rootScope.userData = visitor;
                    } else {
                        // 保存全局用户数据
                        $rootScope.userData = res.data;
                    }
                    if (success) {
                        success($rootScope.userData);
                    }
                };
                var inError = function(response) {
                    errorCallBack(response);
                    if (error) {
                        error(response);
                    }
                };
                if ($rootScope.userData === undefined || isRefush) {
                    token = AuthService.getToken();
                    var url = "/profile/info"; //接口地址由服务器给定
                    apiGet(url, null, inSuccess, inError);
                } else {
                    success($rootScope.userData);
                }
            };


            //分页
            var splitPage = function() {
                var pageIndex = 1,
                    isLoadAll = false,
                    total = 0,
                    dataList = [];
                var getData = function(url, type, callback, isFirst, params) {
                    if (isFirst) {
                        pageIndex = 1;
                        isLoadAll = false;
                        dataList = [];
                    }
                    var parameters = {
                        "page": pageIndex,
                        "size": 10
                    };
                    if (params) {
                        var createParams = function(thisObj) {
                            // console.log(thisObj);
                            parameters[thisObj.name] = thisObj.value;
                        };
                        params.forEach(createParams);
                    }
                    var success = function(res) {
                        console.log(res.data);
                        var pages;
                        if (res.data.pageBean) {
                            dataList = dataList.concat(res.data.pageBean.list);
                            pages = res.data.pageBean.pages;
                        } else {
                            dataList = dataList.concat(res.data.list);
                            pages = res.data.pages;
                        }
                        if (pageIndex < pages) {
                            pageIndex++;
                            isLoadAll = false;
                        } else {
                            isLoadAll = true;
                        }
                        data = res.data;
                        callback(dataList, isLoadAll, data);
                    }
                    if (type == 'post') {
                        apiPost(url, parameters, function(res) {
                            success(res);
                        }, function(res) {
                            console.log('请求失败' + res);
                        });
                    } else {
                        apiGet(url, parameters, function(res) {
                            success(res);
                        }, function(res) {
                            console.log('请求失败' + res);
                        });
                    }
                };
                return {
                    getData: getData
                };
            };

            return {
                get: apiGet,
                post: apiPost,
                postJson: apiPostJson,
                getUserInfo: getUserInfo,
                splitPage: splitPage
            };

        }
    ]);
