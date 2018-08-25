"use strict"
angular.module('userServices',[])

.factory('User',['$http',function ($http) {
  var userFactory = {};

    // New user Registration
    userFactory.create = function (regData) {
      return $http.post('/api/users',regData);
    };

    //Check if username is already taken while registering
    userFactory.checkUsername = function (regData) {
      return $http.post('/api/checkusername',regData);
    };

    // Check if E-mail is availiable
    userFactory.checkEmail = function (regData) {
      return $http.post('/api/checkEmail',regData);
    };

    // Activate user account with e-mail link
    userFactory.activateAccount = function(token) {
        return $http.put('/api/activate/' + token);
    };

    // Check credentials before re-sending activation link
    userFactory.checkCredentials = function(loginData) {
        return $http.post('/api/resend', loginData);
    };

    // Send new activation link to user
    userFactory.resendLink = function(username) {
        return $http.put('/api/resend', username);
    };

    // Send user's username to e-mail
    userFactory.sendUsername = function(userData) {
        return $http.get('/api/resetusername/' + userData);
    };

    // Send password reset link to user's e-mail
    userFactory.sendPassword = function(resetData) {
        return $http.put('/api/resetpassword', resetData);
    };

    // Grab user's information from e-mail reset link
    userFactory.resetUser = function(token) {
        return $http.get('/api/resetpassword/' + token);
    };

    // Save user's new password
    userFactory.savePassword = function(regData) {
        return $http.put('/api/savepassword', regData);
    };

    userFactory.renewSession = function (username) {
        return $http.get('/api/renewToken/' + username);
    };

    userFactory.getPermission = function () {
      return $http.get('/api/permission');
    };

    // Get all the users from database
    userFactory.getUsers = function() {
      return $http.get('/api/management/');
    };

    //Change Permission for user
    userFactory.changePermission = function (details) {
      return $http.put('/api/changePermission',details);
    }

    userFactory.createusers = function (user) {
      return $http.post('/api/createusers',user);
    }
    // add items
    userFactory.additems = function (itemdata) {
      return $http.post('/api/itemscreate',itemdata);
    }
    // get items
    userFactory.getitems = function () {
      return $http.get('/api/getitems');
    }
    // navigate
    userFactory.navigate = function (data) {
      return $http.post('/api/getselected',data);
    }
    return userFactory;
}]);
