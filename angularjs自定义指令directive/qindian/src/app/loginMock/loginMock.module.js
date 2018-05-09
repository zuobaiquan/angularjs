(function () {
  'use strict';

  angular
    .module('stater.mock', [])
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('loginMock', {
        url: '/login-mock',
        cache: false,
        views: {
          'content': {
            templateUrl: 'app/loginMock/loginMock.html',
            controllerAs: 'vm',
            controller: ['AuthService', '$http','ServerConfiguration','$rootScope','$state', function (AuthService, $http, ServerConfiguration,$rootScope,$state) {
              var vm = this;
              if(ServerConfiguration.domain!='http://qdyq.ipzoe.com?v=1'){
                  vm.login = login;
                  $rootScope.isMock = true;
                  function login(phone) {
                    $http({
                      method: "POST",
                      url: ServerConfiguration.baseApiUrl.split('/api')[0] + "/pub/account/sign-in-mock",
                      data: {
                        phone: phone || 123456
                      }
                    }).then(function (res) {
                      if (res.data.code === 200) {
                        console.log(res.data);
                        AuthService.setToken(res.data.data.token);
                        console.log(AuthService.getToken(), '用户Token');
                        $state.go('home');
                      } else if (res.data.code === 10001) {
                        console.log(res,'用户不存在');
                        //微信校验错误
                      }
                    }, function (error) {
                      // deferred.reject(error);
                      alert(error.message);
                    });
                  }
              }

            }]
          }
        },
        data: {
          requireLogin: false
        }
      });
  }

}());
