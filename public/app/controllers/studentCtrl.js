angular.module('studentController',['studentServices'])
.controller('studentCtrl', ['Student', function (Student) {
  var app = this;
  app.dispsem = 4;
  app.disabled = false;
  app.successMsg = undefined;
  app.errorMsg = undefined;
  app.alert = 'default';
  app.slctd = 1;

  app.select = function (num) {
    app.slctd = num;
  };

  app.isSelected = function (num) {
    return app.slctd === num;
  };

  Student.getmarks().then(function (data) {
    if (data.data.success) {
      console.log(data.data.message);
      app.sems = data.data.message;
    } else {
      app.alert = 'alert alert-danger';
      app.errorMsg = data.data.message;
    }
  });
}]);
