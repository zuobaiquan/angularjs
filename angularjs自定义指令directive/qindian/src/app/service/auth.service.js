/**
    微信登录授权服务及微信接口功能实现
**/

angular.module('starter.services')

  .factory('AuthService', ['$http', '$q', '$window', 'ServerConfiguration', 'verify', '$ionicLoading',
    function ($http, $q, $window, ServerConfiguration, verify, $ionicLoading) {

      var appBase = {
        wxJsConfigStatus: false,
        clearJwt: false,
        root: ServerConfiguration.webRoot,
        baseUrl: ServerConfiguration.baseApiUrl,
        tempDataPrefix: "eva-projectname-temp-data-",
        localJwtKey: "eva-projectname-jwt"
      };

      function wxJsConfig(callback, refresh) {
        console.log("配置微信JS-SDK Config", appBase.wxJsConfigStatus);
        if (appBase.wxJsConfigStatus && !refresh) {
          if (callback) {
            callback();
          }
          return;
        }
        //获取JS-SDK的Config
        var webUrl = $window.location.href.split('#')[0];
        console.log("微信配置的URL地址: " + webUrl);
        var jwt = $window.localStorage.getItem(appBase.localJwtKey);
        $http({
          method: 'POST',
          url: appBase.baseUrl.split('/api')[0] + "/pub/account/wx-js-config",
          data: {
            url: webUrl
          },
          headers: {
            'X-Auth-Token': jwt
          }
        }).then(function (res) {
          console.log(res);
          //开启调试模式,则 res.data.data.debug=true ,微信端运行的时候会出现弹出框
          res.data.data.debug = false;
          wx.config(res.data.data);
          appBase.wxJsConfigStatus = true;
          wx.ready(function () {
            console.log('ready');
            if (callback) {
              callback();
            }
          });
        }, function (error) {
          console.log(error);
        });
      }

      function login() {
        console.log("配置微信JS-SDK Config", "appBase: " + appBase.baseUrl);
        var jwt = $window.localStorage.getItem(appBase.localJwtKey);
        if (jwt && jwt != 'undefined') {
          wxJsConfig();
          return {
            result: 'ok'
          };
        } else {
          // 微信授权登录
          var code = getUrlVar("code");
          var status = getUrlVar("state");
          var deferred = $q.defer();
          console.log("微信code: " + code);
          console.log("微信status: " + status);
          if (code && status) {
            $http({
              method: "POST",
              url: appBase.baseUrl.split('/api')[0] + "/pub/account/wx-sign-in",
              data: {
                code: code
              }
            }).then(function (res) {
              if (res.data.code === 200) {
                console.log(res.data);
                setToken(res.data.data.token);
                deferred.resolve(res);
              } else if (res.data.code === 10001) {
                //微信校验错误
                alert(JSON.stringify(res.data));
              }


            }, function (error) {
              deferred.reject(error);
            });
            return {
              result: 'ok',
              promise: deferred.promise
            };
          } else {
            $window.localStorage.clear();
            var referrerId = -1;
            if (getUrlVar("referrer")) {
              referrerId = getUrlVar("referrer").split("#")[0];
            }
            $http({
              method: "POST",
              url: appBase.baseUrl.split('/api')[0] + "/pub/account/wx-oauth",
              data: {
                go: $window.location.hash.replace('#', ''),
                referrer: referrerId
              }
            }).then(function (res) {
              deferred.resolve(res.data);
            }, function (error) {
              deferred.reject(error);
            });
            return {
              result: 'redirect',
              promise: deferred.promise
            };
          }
        }
      }

      function loginMock(openId) {
        console.log("开发环境模拟登录(Chrome，非微信)");
        console.log("appBase: " + appBase.baseUrl);
        var jwt = $window.localStorage.getItem(appBase.localJwtKey);
        // 微信授权登录
        var deferred = $q.defer();
        console.log("openId: " + openId);
        $http({
          method: "POST",
          url: appBase.baseUrl.split('/api')[0] + "/pub/account/sign-in-mock",
          data: {
            // openId: openId,
            phone: '123456'
          }
        }).then(function (res) {
          console.log('登录成功');
          console.log(res);
          deferred.resolve(res);
        }, function (error) {
          deferred.reject(error);
        });
        return {
          result: 'ok',
          promise: deferred.promise
        };
        // }
      }

      function setToken(token) {
        $window.localStorage.setItem(appBase.localJwtKey, token);
      }

      function getToken() {
        return $window.localStorage.getItem(appBase.localJwtKey);
      }

      function removeToken() {
        return $window.localStorage.removeItem(appBase.localJwtKey);
      }


      function getUrlVars() {
        var vars = [],
          hash;
        var hashes = $window.location.href.slice($window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
        }
        console.log('vars');
        console.log(vars);
        return vars;
      }

      function getUrlVar(name) {
        return getUrlVars()[name];
      }

      function chooseImage(count, callback) {
        //图片上传，上传到微信服务器
        wxJsConfig(function () {
          wx.chooseImage({
            count: count,
            success: function (res) {
              console.log(res.localIds);
              uploadImage(res.localIds, callback);
            },
            fail: function (res) {
              console.log(res);
              verify.tooltip('上传服务器失败');
            }
          });
        });
      }

      function uploadImage(localIds, callback) {
        console.log(localIds);
        var serviceIds = [];
        var uploadToWx = function (index) {
          console.log(index);
          console.log(localIds[localIds.length - index]);
          wx.uploadImage({
            localId: localIds[localIds.length - index],
            isShowProgressTips: 1,
            success: function (res) {
              serviceIds.push(res.serverId);
              if (serviceIds.length < localIds.length) {
                uploadToWx(--index);
              } else {
                $ionicLoading.show({
                  template: '图片加载中...'
                });
                //通知服务器到微信服务器上下载资源，接口地址由服务器给定
                $http({
                  method: "POST",
                  url: appBase.baseUrl.split('/api')[0] + "/pub/wx-media/save",
                  data: {
                    mediaId: serviceIds.join(';')
                  }
                }).then(function (res) {
                  $ionicLoading.hide();
                  if (res.data.code == 200) {
                    callback(res.data.data);
                    console.log(res.data.data);
                  } else {
                    verify.tooltip('加载失败，请稍后再试');
                  }
                }, function (error) {
                  $ionicLoading.hide();
                  console.error("API Error");
                });
              }
            },
            fail: function (res) {
              verify.tooltip(res.errMsg);
            }
          });
        };
        uploadToWx(localIds.length);
      }

      //图片预览，点击查看大图
      function previewImage(url, list) {
        wx.previewImage({
          current: url,
          urls: list
        });
      }

      function setShareConfig(data, callback) {
        var jwt = $window.localStorage.getItem(appBase.localJwtKey);
        // var data = res.data.data;
        wxJsConfig(function () {
          console.log("微信配置成功");
          console.log(data);
          var reg = /\?{1}.*(code).*#/;
          if (reg.test(data.link)) {
            //含有code 的是文章分享
            data.link = $window.location.hostname + $window.location.pathname + $window.location.hash;
          }
          // 设置分享内容
          // 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
          wx.onMenuShareAppMessage({
            title: data.title,
            desc: data.desc,
            link: data.link,
            imgUrl: data.imgUrl,
            trigger: function (res) {
              // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
              console.log('用户点击发送给朋友');
            },
            success: function (res) {
              console.log('已分享');
              if (callback) {
                callback('success');
              }
            },
            cancel: function (res) {
              console.log('已取消');
              if (callback) {
                callback('cancel');
              }
            },
            fail: function (res) {
              if (callback) {
                callback('fail');
              }
              alert(JSON.stringify(res));
            }
          });

          // 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
          wx.onMenuShareTimeline({
            title: data.title,
            link: data.link,
            imgUrl: data.imgUrl,
            trigger: function (res) {
              // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
              console.log('用户点击分享到朋友圈');
            },
            success: function (res) {
              console.log('已分享');
              if (callback) {
                callback('success');
              }
            },
            cancel: function (res) {
              console.log('已取消');
              if (callback) {
                callback('cancel');
              }
            },
            fail: function (res) {
              alert(JSON.stringify(res));
              if (callback) {
                callback('fail');
              }
            }
          });
          // 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
          wx.onMenuShareQQ({
            title: data.title,
            desc: data.desc,
            link: data.link,
            imgUrl: data.imgUrl,
            trigger: function (res) {
              console.log('用户点击分享到QQ');
            },
            complete: function (res) {
              console.log(JSON.stringify(res));
              if (callback) {
                callback('complete');
              }
            },
            success: function (res) {
              console.log('已分享');
              if (callback) {
                callback('success');
              }
            },
            cancel: function (res) {
              console.log('已取消');
              if (callback) {
                callback('cancel');
              }
            },
            fail: function (res) {
              alert(JSON.stringify(res));
              if (callback) {
                callback('fail');
              }
            }
          });
          // 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
          wx.onMenuShareWeibo({
            title: data.title,
            desc: data.desc,
            link: data.link,
            imgUrl: data.imgUrl,
            trigger: function (res) {
              console.log('用户点击分享到微博');
            },
            complete: function (res) {
              console.log(JSON.stringify(res));
              if (callback) {
                callback('complete');
              }
            },
            success: function (res) {
              console.log('已分享');
              if (callback) {
                callback('success');
              }
            },
            cancel: function (res) {
              console.log('已取消');
              if (callback) {
                callback('cancel');
              }
            },
            fail: function (res) {
              alert(JSON.stringify(res));
              if (callback) {
                callback('fail');
              }
            }
          });
          // 监听“分享到QZone”按钮点击、自定义分享内容及分享接口
          wx.onMenuShareQZone({
            title: data.title,
            desc: data.desc,
            link: data.link,
            imgUrl: data.imgUrl,
            trigger: function (res) {
              console.log('用户点击分享到QZone');
            },
            complete: function (res) {
              console.log(JSON.stringify(res));
              if (callback) {
                callback('complete');
              }
            },
            success: function (res) {
              console.log('已分享');
              if (callback) {
                callback('success');
              }
            },
            cancel: function (res) {
              console.log('已取消');
              if (callback) {
                callback('cancel');
              }
            },
            fail: function (res) {
              alert(JSON.stringify(res));
              if (callback) {
                callback('fail');
              }
            }
          });
        });
      }

      //微信支付
      function payMoney(param, func) {
        wxJsConfig(function () {
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest', param,
            function (res) {
              console.log(res);
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                verify.tooltip('支付成功');
                func();
              } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                verify.tooltip('支付已取消');
              } else {
                verify.tooltip('支付失败');
              }
            }
          );
        }, true);
      }

      function getLocation(callback, reject) {
        wxJsConfig(function () {
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              callback(res);
            },
            fail: function (res) {
              verify.tooltip('微信位置获取失败');
              reject(res);
            },
            cancel: function (res) {
              verify.tooltip('用户拒绝授权获取地理位置,');
              reject(res);
            }
          });
        });
      }

      //隐藏分享按钮
      function hideShareMenuItems() {
        wxJsConfig(function () {
          wx.hideAllNonBaseMenuItem();
        });
      }

      function showShareMenuItems() {
        wxJsConfig(function () {
          wx.showAllNonBaseMenuItem();
          wx.hideMenuItems({
            menuList: ['menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:openWithSafari'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
          });
        });
      }


      return {
        login: login,
        loginMock: loginMock,
        setToken: setToken,
        getToken: getToken,
        removeToken: removeToken,
        wxJsConfig: wxJsConfig,
        chooseImage: chooseImage,
        previewImage: previewImage,
        setShareConfig: setShareConfig,
        payMoney: payMoney,
        getUrlVar: getUrlVar,
        getWxLocation: getLocation,
        hideShareMenuItems: hideShareMenuItems,
        showShareMenuItems: showShareMenuItems
      };

    }
  ]);
