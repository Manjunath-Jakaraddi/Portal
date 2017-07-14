angular.module('managementController', [])

.controller('managementCtrl', function(User, $scope) {
    var app = this;

    app.loading = true;
    app.accessDenied = true;
    app.errorMsg = false;
    app.editAccess = false;
    app.deleteAccess = false;
    app.limit = 5;
    app.searchLimit = 0;
    app.options = [{value: 'admin',label: 'admin'},{value: 'student',label: 'student'},{value: 'teacher', label: 'teacher'}];

    function getUsers() {
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
});
