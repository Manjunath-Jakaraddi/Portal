'use strict';
angular.module('studentServices',[])

.factory('Student',['$http', function ($http) {
  var studentFactory = {};
  
  studentFactory.getmarks = function () {
    return $http.get('/student/api/getmarks');
  };

  return studentFactory;
}]);
