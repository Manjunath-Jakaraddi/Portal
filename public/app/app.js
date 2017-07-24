"use strict";
angular.module('MyApp',[
    'AppRoutes',
    'userControllers',
    'userServices',
    'mainController',
    'authServices',
    'emailController',
    'ngAnimate',
    'studentController',
    'teacherController',
    'managementController',
    'studentServices',
    'teacherServices'
])

.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
}]);
