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
    'managementController'
])

.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
}]);
