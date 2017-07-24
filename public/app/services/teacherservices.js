'use strict';
angular.module('teacherServices',[])

.factory('Teacher',['$http', function ($http) {
  var teacherFactory = {};

  teacherFactory.createsubject = function (details) {
    return $http.post('/student/api/createsubject',details);
  };

  teacherFactory.getsubjects = function () {
    return $http.get('/student/api/getsubjects');
  };

  teacherFactory.updatemarks = function (payload) {
    return $http.post('/student/api/updatemarks',payload);
  }

  return teacherFactory;
}]);
