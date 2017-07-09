"use strict";
angular.module('mainController',['authServices','userServices'])

.controller('mainCtrl',['Auth','$scope','$location','$timeout','$rootScope','$window','$interval','User','AuthToken',function (Auth, $scope, $location,$timeout,$rootScope,$window,$interval,User,AuthToken) {
    var app = this;
    app.loadme = true;

    if( $window.location.pathname === '/') app.home = true;

    if (Auth.isLoggedIn()) {
        Auth.getUser().then(function (data) {
          if(data.data.username === undefined) {
            Auth.logout();
            app.isLoggedIn = false;
            $location.path('/');
            app.loadme = true;
          }
        });
    }

    var showModal = function (option) {
      app.choiceMade = false;
      app.modalHeader = undefined;
      app.modalBody = undefined;
      app.hideButton = false;

      if(option === 1) {
        app.modalHeader = 'Timeout Warning';
        app.modalBody = 'Your session will expire in 30 minutes.Would you like to renew your session?';
        $('#myModal').modal({ backdrop: "static" });
        $timeout(function () {
          if(!app.choiceMade) app.endSession();
        },10000);
      } else if (option === 2 ) {
        app.hideButton = true;
        app.modalHeader = 'Logging Out';
        $('#myModal').modal({ backdrop: "static" });
        $timeout(function () {
          Auth.logout();
          $location.path('/logout');
          hideModal();
        },2000);
      }
    };

    var hideModal = function () {
      $('#myModal').modal('hide');
    };

    app.checkSession = function () {
        if(Auth.isLoggedIn()) {
          app.checkingSession = true;

          var interval = $interval(function () {
            var token = AuthToken.getToken();
            if (token === null) {
              $interval.cancel(interval);
            } else {
              self.parseJwt = function (token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-','+').replace('_','/');
                return JSON.parse($window.atob(base64));
              };
              var expireTime = self.parseJwt(token);
              var timeStamp = Math.floor(Date.now() / 1000);
              var timeCheck = expireTime.exp - timeStamp;

              if(timeCheck <= 1800) {
                showModal(1);
                $interval.cancel(interval);
              }
            }
          },30000);
        }
    };

    app.renewSession = function () {
        app.choiceMade = true;
        User.renewSession(app.username).then(function (data) {
          if (data.data.success) {
            AuthToken.setToken(data.data.token);
            app.checkSession();
          } else {
            app.modalBody = data.data.message;
          }
        });
        hideModal();
    };

    app.endSession = function () {
      app.choiceMade = true;
      hideModal();
      $timeout(function () {
        showModal(2);
      },1000);
    };

    app.checkSession();
    $rootScope.$on('$routeChangeSuccess',function () {
      if($window.location.pathname === '/') {
        app.home = true;
      } else {
        app.home = false;
      }
    });

    $rootScope.$on('$routeChangeStart',function () {
      if (!app.checkingSession) app.checkSession();

      if (Auth.isLoggedIn()) {
        Auth.getUser().then(function (data) {
          if (data.data.username === undefined) {
            app.isLoggedIn = false;
            Auth.logout();
            $location.path('/');
          } else {
            app.isLoggedIn = true;
            //
            app.loadme = true;
            //
            app.username = data.data.username;
            var checkLoginStatus = data.data.username;
            app.email = data.data.email;
            // Missing about permissions
          }
        });
      } else {
        app.isLoggedIn = false;
        app.username = false;
        app.loadme = true;
      }
      app.disabled = false;
      app.errorMsg = false;
    });

    app.doLogin = function (loginData) {
        app.loading = true;
        app.errorMsg = false;
        app.expired = false;
        app.disabled = true;
        $scope.alert = 'default';

        Auth.login(app.loginData).then(function (data) {
            if(data.data.success) {
                app.loading = false;
                $scope.alert = 'alert alert-success';
                app.successMsg = data.data.message + '...Redirecting';
                app.token = data.data.token;
                $timeout(function () {
                    $location.path('/');
                    app.loginData = null;
                    app.successMsg = false;
                    app.disabled = false;
                    app.checkSession();
                },2000);
            } else {
                if(data.data.expired) {
                    app.expired = true;
                    app.loading = false;
                    $scope.alert = 'alert alert-danger';
                    app.errorMsg = data.data.message;
                } else {
                    app.loading = false;
                    app.disabled = false;
                    $scope.alert = 'alert alert-danger';
                    app.errorMsg = data.data.message;
                }
            }
        });
    };
    app.logout = function() {
        showModal(2);
    };
}]);
