'use strict';
var app = angular.module('AppRoutes',['ngRoute'])
.config(['$routeProvider','$locationProvider',function ($routeProvider,$locationProvider) {
  $routeProvider

    // Route: Home
    .when('/',{
      templateUrl: 'app/views/pages/home.html'
    })

    // Route: About Us
    .when('/about',{
      templateUrl: 'app/views/pages/about.html'
    })

    //Route: User Registration
    .when('/register',{
      templateUrl: 'app/views/pages/users/register.html',
      controller: 'regCtrl',
      controllerAs: 'register',
      authenticated: false
    })

    // Route: User Login
    .when('/login',{
      templateUrl: 'app/views/pages/users/login.html',
      authenticated: false
    })

    // Route: User Profile
    .when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html',
        authenticated: true
    })

    // Route: Activate Account Through E-mail
    .when('/activate/:token', {
        templateUrl: 'app/views/pages/users/activation/activate.html',
        controller: 'emailCtrl',
        controllerAs: 'email',
        authenticated: false
    })

    // Route: Request New Activation Link
    .when('/resend', {
        templateUrl: 'app/views/pages/users/activation/resend.html',
        controller: 'resendCtrl',
        controllerAs: 'resend',
        authenticated: false
    })

    // Route: Send Username to E-mail
    .when('/resetusername', {
        templateUrl: 'app/views/pages/users/reset/username.html',
        controller: 'usernameCtrl',
        controllerAs: 'username',
        authenticated: false
    })

    // Route: Send Password Reset Link to User's E-mail
    .when('/resetpassword', {
        templateUrl: 'app/views/pages/users/reset/password.html',
        controller: 'passwordCtrl',
        controllerAs: 'password',
        authenticated: false
    })

    // Route: User Enter New Password & Confirm
    .when('/reset/:token', {
        templateUrl: 'app/views/pages/users/reset/newpassword.html',
        controller: 'resetCtrl',
        controllerAs: 'reset',
        authenticated: false
    })

    // Route: Student Page
    .when('/student', {
        templateUrl: 'app/views/pages/student/student.html',
        controller: 'studentCtrl',
        controllerAs: 'student',
        authenticated: true,
        permission: 'student'
    })

    // Route: Teacher's Page
    .when('/teacher', {
        templateUrl: 'app/views/pages/teacher/teacher.html',
        controller: 'teacherCtrl',
        controllerAs: 'teacher',
        authenticated: true,
        permission: 'teacher'
    })
    // Route: Teacher's Page
    .when('/teacher/createsubject', {
        templateUrl: 'app/views/pages/teacher/createsubject.html',
        controller: 'teacherCtrl',
        controllerAs: 'teacher',
        authenticated: true,
        permission: 'teacher'
    })

    // Route: Management Page
    .when('/management', {
        templateUrl: 'app/views/pages/management/management.html',
        controller: 'managementCtrl',
        controllerAs: 'management',
        authenticated: true,
        permission: 'admin'
    })

    .otherwise({ redirectTo: '/' });
    $locationProvider.html5Mode({ enabled: true, requireBase: false });
}]);

app.run(['$rootScope','Auth','$location','User',function ($rootScope, Auth, $location, User) {
    $rootScope.$on('$routeChangeStart',function (event, next, current) {
      if(next.$$route !== undefined) {
          if(next.$$route.authenticated === true) {
            if(!Auth.isLoggedIn()) {
              event.preventDefault();
              $location.path('/');
            } else if (next.$$route.permission) {
              User.getPermission().then(function (data) {
                if (next.$$route.permission !== data.data.permission) {
                  event.preventDefault();
                  $location.path('/');
                }
              });
            }
          } else if(next.$$route.authenticated === false) {
              if(Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/profile');
              }
          }
      }
    });
}]);
