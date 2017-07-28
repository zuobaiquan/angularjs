'use strict'
angular.module('app').config(['$stateProvider','$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('main', {
        url: '/main',
        templateUrl: 'view/main.html',
        controller: 'mainCtrl'
    }).state('search', {
        url: '/search',
        templateUrl: 'view/search.html',
        controller: 'searchCtrl'
    }).state('mine', {
        url: '/mine',
        templateUrl: 'view/mine.html',
        controller: 'mineCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: 'view/login.html',
        controller: 'loginCtrl'
    }).state('register', {
        url: '/register',
        templateUrl: 'view/register.html',
        controller: 'registerCtrl'
    }).state('jobs',{
        url: '/jobs/:id',
        templateUrl: 'view/jobs.html',
        controller: 'jobsCtrl'
    }).state('company',{
        url: '/company/:id',
        templateUrl: 'view/company.html',
        controller: 'companyCtrl'
    }).state('post',{
        url: '/post',
        templateUrl: 'view/post.html',
        controller: 'postCtrl'
    }).state('favorite',{
        url: '/favorite',
        templateUrl: 'view/favorite.html',
        controller: 'favoriteCtrl'
    }).state('pass',{
        url: '/pass',
        templateUrl: 'view/pass.html',
        controller: 'passCtrl'
    });
    $urlRouterProvider.otherwise('main');
}]);