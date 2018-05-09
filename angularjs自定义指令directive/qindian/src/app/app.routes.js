angular.module('starter.routes', [])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/home/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'vm'
          }
        },
        data: {
          requireLogin: true
        }
      })
    $urlRouterProvider.when('', '/home');
  }])
  .run(['$rootScope', '$window', '$state', 'APP', '$ionicHistory', '$location', 'ServerConfiguration', 'AuthService',
    function ($rootScope, $window, $state, APP, $ionicHistory, $location, ServerConfiguration, AuthService) {
      //只能走一次
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin, response;
        console.log(toState, 'state');
        if (!$rootScope.drayouPlatform) {
          $rootScope.drayouPlatform = ionic.Platform.platform();
        }
        var allShareConfig = function () {
          if (toState === 'groupShare') {
            AuthService.showShareMenuItems();
          } else {
            AuthService.hideShareMenuItems();
          }
        };
        if (!$rootScope.goBack) {
          $rootScope.goBack = function () {
            $ionicHistory.goBack(-1);
          }
        }
        if(ServerConfiguration.domain!='http://qdyq.ipzoe.com?v=1'){
            if (toState.name === 'loginMock' || toState.name === 'groupShare'){
              console.log('模拟登录');
              return;
            }
        }
        if (!APP.devMode) { // 正式环境
          requireLogin = toState.data.requireLogin;
          if (!AuthService.getToken()) {
            console.log('登录回调');
            event.preventDefault();
            console.log(JSON.stringify(toState.params));
            response = AuthService.login();
            if (response.result === 'redirect') {
              response.promise.then(function (res) {
                console.log('重定向', res.data);
                console.log(res.data, 'redirective')
                $window.location.href = res.data;
                allShareConfig();
              });
            } else if (response.result === 'ok') {
              var path = AuthService.getUrlVar("go") || '/app/home'; //回调地址所带参数，
              console.log(AuthService.getUrlVar("go"), 'path')
              var base = ServerConfiguration.domain;
              response.promise.then(function (res) {
                AuthService.wxJsConfig();

                $rootScope.currentUser = res.data.data;

                $window.location.href = base + '#' + path;
                allShareConfig();

              }, function (error) { // 错误回调
                console.error('请求失败: ' + error);
              });
            }
          } else {
            console.log(toState.name);
            if ($rootScope.user_Data && $rootScope.user_Data.profile.isComplete === 0 && toState.name != 'app.profile') {
              $state.go('app.profile');
            }
            allShareConfig();
          }
        } else { // 开发环境
          //   $state.go(toState.name,toParams);
          // //   requireLogin = toState.data.requireLogin;
          //   if (requireLogin && (AuthService.getToken() == 'undefined' || !AuthService.getToken())) {
          //       event.preventDefault();
          //       response = AuthService.loginMock('oOxc4v0VZAUC-Z_oTTgHy5OukQ7Y');
          //       console.log(response,'login')
          //       if (response.result === 'ok') {
          //           response.promise.then(function(res) { // 成功回调
          //               // $rootScope.currentUser = res.data.data;
          //               AuthService.setToken(res.data.data.token);
          //               // if(res.data.data.status == 1){
          //               //     $state.go('app.freeze');
          //               // }else{
          //               //     if (res.data.data.profile.isComplete === 0) {
          //                   //     $state.go('app.profile');
          //                   // } else {
          //                       $state.go(toState.name,toParams);
          //               //     }
          //               // }
          //           }, function(error) { // 错误回调
          //               console.error('请求失败: ' + error);
          //               console.log('失败回调');
          //           });
          //       }
          //   }
        }
      });
    }
  ]);
