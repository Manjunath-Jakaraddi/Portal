"use strict";
angular.module('MyApp',['AppRoutes','userControllers','userServices','mainController','authServices','emailController','ngAnimate'])

.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
}]);
