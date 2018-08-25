angular.module('userControllers',['userServices'])

.controller('regCtrl',['$scope','$location','$timeout','User',function ($scope,$location,$timeout,User) {

    var app = this;
    app.regUser = function (regData, valid, confirmed) {
      app.disabled = true;
      $('.loading-manju').loading({ base: 0.2 });
      app.errorMsg = false;

      if(valid && confirmed) {
        app.regData.name = app.regData.firstName + " " + app.regData.lastName;
        User.create(app.regData).then(function (data) {
          if(data.data.success) {
            $('.loading-manju').loading({ destroy: true });
            $scope.alert = 'alert alert-success';
            app.successMsg = data.data.message + "...Redirecting";
            $timeout(function () {
                $location.path('/login');
            },2000);
          } else {
            $('.loading-manju').loading({ destroy: true });
            app.disabled = false;
            $scope.alert = 'alert alert-danger';
            app.errorMsg = data.data.message;
          }
        });
      } else {
        $('.loading-manju').loading({ destroy: true });
        app.disabled = false;
        $scope.alert = 'alert alert-danger';
        app.errorMsg = 'Please ensure form is filled out Properly'
      }
    };

    // Checking usename availability
    app.checkUsername = function (regData) {
        app.checkingUsername = true;
        app.usernameMsg = false;
        app.usernameInvalid = false;

        User.checkUsername(app.regData).then(function (data) {
            if(data.data.success) {
                app.checkingUsername = false;
                app.usernameMsg = data.data.message;
            } else {
                app.checkingUsername = false;
                app.usernameInvalid = true;
                app.usernameMsg = data.data.message;
            }
        });
    };


    app.checkEmail = function(regData) {
        app.checkingEmail = true;
        app.emailMsg = false;
        app.emailInvalid = false;
        User.checkEmail(app.regData).then(function(data) {

            if (data.data.success) {
                app.checkingEmail = false;
                app.emailMsg = data.data.message;
            } else {
                app.checkingEmail = false;
                app.emailInvalid = true;
                app.emailMsg = data.data.message;
            }
        });
    };


}])
.controller('usersRegCtrl',['$scope','$location','$timeout','User',function ($scope,$location,$timeout,User) {

    var app = this;
    app.regUser = function (regData, valid, confirmed) {
      app.disabled = true;
      $('.loading-manju').loading({ base: 0.2 });
      app.errorMsg = false;

      if(valid && confirmed) {
        app.regData.name = app.regData.firstName + " " + app.regData.lastName;
        User.create(app.regData).then(function (data) {
          if(data.data.success) {
            $('.loading-manju').loading({ destroy: true });
            $scope.alert = 'alert alert-success';
            app.successMsg = data.data.message + "...Redirecting";
            $timeout(function () {
                $location.path('/login');
            },2000);
          } else {
            $('.loading-manju').loading({ destroy: true });
            app.disabled = false;
            $scope.alert = 'alert alert-danger';
            app.errorMsg = data.data.message;
          }
        });
      } else {
        $('.loading-manju').loading({ destroy: true });
        app.disabled = false;
        $scope.alert = 'alert alert-danger';
        app.errorMsg = 'Please ensure form is filled out Properly'
      }
    };

    // Checking usename availability
    app.checkUsername = function (regData) {
        app.checkingUsername = true;
        app.usernameMsg = false;
        app.usernameInvalid = false;

        User.checkUsername(app.regData).then(function (data) {
            if(data.data.success) {
                app.checkingUsername = false;
                app.usernameMsg = data.data.message;
            } else {
                app.checkingUsername = false;
                app.usernameInvalid = true;
                app.usernameMsg = data.data.message;
            }
        });
    };


    app.checkEmail = function(regData) {
        app.checkingEmail = true;
        app.emailMsg = false;
        app.emailInvalid = false;
        User.checkEmail(app.regData).then(function(data) {

            if (data.data.success) {
                app.checkingEmail = false;
                app.emailMsg = data.data.message;
            } else {
                app.checkingEmail = false;
                app.emailInvalid = true;
                app.emailMsg = data.data.message;
            }
        });
    };


}])
.controller('retailRegCtrl',['$scope','$location','$timeout','User',function ($scope,$location,$timeout,User) {

    var app = this;
    app.regUser = function (regData, valid, confirmed) {
      console.log(app.regData);
      app.disabled = true;
      $('.loading-manju').loading({ base: 0.2 });
      app.errorMsg = false;

      if(valid && confirmed) {
        app.regData.name = app.regData.firstName + " " + app.regData.lastName;
        User.create(app.regData).then(function (data) {
          if(data.data.success) {
            $('.loading-manju').loading({ destroy: true });
            $scope.alert = 'alert alert-success';
            app.successMsg = data.data.message + "...Redirecting";
            $timeout(function () {
                $location.path('/login');
            },2000);
          } else {
            $('.loading-manju').loading({ destroy: true });
            app.disabled = false;
            $scope.alert = 'alert alert-danger';
            app.errorMsg = data.data.message;
          }
        });
      } else {
        $('.loading-manju').loading({ destroy: true });
        app.disabled = false;
        $scope.alert = 'alert alert-danger';
        app.errorMsg = 'Please ensure form is filled out Properly'
      }
    };
}])
.controller('usersRegCtrl',['$scope','$location','$timeout','User',function ($scope,$location,$timeout,User) {

    var app = this;
    app.regUser = function (regData, valid, confirmed) {
      console.log(app.regData);
      app.disabled = true;
      $('.loading-manju').loading({ base: 0.2 });
      app.errorMsg = false;

      if(valid && confirmed) {
        app.regData.name = app.regData.firstName + " " + app.regData.lastName;
        User.create(app.regData).then(function (data) {
          if(data.data.success) {
            $('.loading-manju').loading({ destroy: true });
            $scope.alert = 'alert alert-success';
            app.successMsg = data.data.message + "...Redirecting";
            $timeout(function () {
                $location.path('/login');
            },2000);
          } else {
            $('.loading-manju').loading({ destroy: true });
            app.disabled = false;
            $scope.alert = 'alert alert-danger';
            app.errorMsg = data.data.message;
          }
        });
      } else {
        $('.loading-manju').loading({ destroy: true });
        app.disabled = false;
        $scope.alert = 'alert alert-danger';
        app.errorMsg = 'Please ensure form is filled out Properly'
      }
    };
}])
.directive('match', function() {
    return {
        restrict: 'A',
        controller: function($scope) {
            $scope.confirmed = false;

            $scope.doConfirm = function(values) {
                values.forEach(function(ele) {
                    if ($scope.confirm == ele) {
                        $scope.confirmed = true;
                    } else {
                        $scope.confirmed = false;
                    }
                });
            };
        },

        link: function(scope, element, attrs) {
            attrs.$observe('match', function() {
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });
            scope.$watch('confirm', function() {
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });
        }
    };
});
