angular.module('studentController',['studentServices'])
.controller('studentCtrl', ['Student', function (Student) {
  var app = this;
  app.dispsem = 4;
  app.disabled = false;
  app.successMsg = undefined;
  app.errorMsg = undefined;
  app.alert = 'default';
  app.slctd = 1;
  app.data_display = undefined;
  app.select = function (num) {
    app.slctd = num;
  };

  app.isSelected = function (num) {
    return app.slctd === num;
  };

  Student.getmarks().then(function (data) {
    if (data.data.success) {
      app.data_display= data.data.message;
      console.log(data.data.message);
      //SEM
        //subjectname
        //subjectcode
        //cie1
          //theory quiz total max max max
        //cie2
          //theory quiz total max max max
        //cie3
          //theory quiz total max max max
    } else {
      app.alert = 'alert alert-danger';
      app.errorMsg = data.data.message;
    }
  });
}]);
