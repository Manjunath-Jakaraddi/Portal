angular.module('managementController', [])

.controller('managementCtrl', ['User','$scope','$timeout',function(User, $scope, $timeout) {
    var app = this;

    app.loading = true;
    app.accessDenied = true;
    app.errorMsg = false;
    app.editAccess = false;
    app.deleteAccess = false;
    app.limit = 10;
    app.searchLimit = 0;
    app.options = [{value: 'admin',label: 'admin'},{value: 'student',label: 'student'},{value: 'teacher', label: 'teacher'}];

    function getUsers() {
      app.loading = true;
        User.getUsers().then(function(data) {
            if (data.data.success) {
                if (data.data.permission === 'admin') {
                    app.users = data.data.users;
                    app.loading = false;
                    app.accessDenied = false;
                } else {
                    app.errorMsg = 'Insufficient Permissions';
                    app.loading = false;
                }
            } else {
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        });
    }

    getUsers();


    app.showMore = function(number) {
        app.showMoreError = false;

        if (number > 0) {
            app.limit = number;
        } else {
            app.showMoreError = 'Please enter a valid number';
        }
    };

    app.showAll = function() {
        app.limit = undefined;
        app.showMoreError = false;
    };



    app.search = function(searchKeyword, number) {

        if (searchKeyword) {

            if (searchKeyword.length > 0) {
                app.limit = 0;
                $scope.searchFilter = searchKeyword;
                app.limit = number;
            } else {
                $scope.searchFilter = undefined;
                app.limit = 0;
            }
        } else {
            $scope.searchFilter = undefined;
            app.limit = 0;
        }
    };


    app.clear = function() {
        $scope.number = undefined;
        app.limit = 0;
        $scope.searchKeyword = undefined;
        $scope.searchFilter = undefined;
        app.showMoreError = false;
    };

    app.saveChanges = function (details) {
      User.changePermission(details).then(function (data) {
        if (data.data.success) {
          getUsers();
        } else {
          app.showMoreError = data.data.message;
        }
      });
    }

    app.upload = function () {
      $('.loading-manju').loading({ base: 0.2 });
      app.successMsg = undefined;
      app.errorMsg = undefined;
      app.alert = 'default';
      User.createusers(app.obj).then(function (data) {
        if (data.data.success) {
          app.alert = 'alert alert-success';
          app.successMsg = data.data.message;
        } else {
          app.alert = 'alert alert-danger';
          app.errorMsg = data.data.message;
        }
        $timeout(function () {
          getUsers();
          $('.loading-manju').loading({ destroy: true });
          app.successMsg = undefined;
          app.errorMsg = undefined;
          app.obj = undefined;
        },3000);
      });
    };
}]);
