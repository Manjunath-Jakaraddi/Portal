angular.module('teacherController',['ngFileToJson','teacherServices'])
.controller('teacherCtrl',['Teacher','$location','$timeout',function (Teacher,$location,$timeout) {
  var app = this;
  app.disabled = false;
  app.successMsg = undefined;
  app.errorMsg = undefined;
  app.alert = 'default';



  app.createsubject = function (subjectData,valid) {
    app.disabled = true;
    $('.loading-manju').loading({ base: 0.2 });
    if (valid) {
      Teacher.createsubject(app.subjectData).then(function (data) {
        if (data.data.success) {
          $('.loading-manju').loading({ destroy: true });
          app.successMsg = data.data.message;
          app.alert = 'alert alert-success';
          app.disabled = false;
          $timeout(function () {
            $location.path('/teacher');
          },2000);
        } else {
          $('.loading-manju').loading({ destroy: true });
          app.errorMsg = data.data.message;
          app.alert = 'alert alert-danger';
          app.disabled = false;
        }
        app.subjectData = null;
      });
    } else {
      $('.loading-manju').loading({ destroy: true });
      app.errorMsg = "check all details are correct!";
      app.alert = 'alert alert-danger';
      app.disabled = false;
    }
  };

  function getsubjects() {
    Teacher.getsubjects().then(function (data) {
      $('.loading-manju').loading({ base: 0.2 });
      if (data.data.success) {
        $('.loading-manju').loading({ destroy: true });
        app.subjects = data.data.message;
      } else {
        $('.loading-manju').loading({ destroy: true });
        app.alert = 'alert alert-danger';
        app.errorMsg = data.data.message;
      }
    })
  };

  getsubjects();

  app.updatemarks = function (details, file) {
    app.disabled = true;
    $('.loading-manju').loading({ base: 0.2 });
    var payload = {};
    payload.details = app.details.selectedsubject;
    payload.file = file;
    payload.Cie = app.details.selectedCie;
    console.log(payload);
    Teacher.updatemarks(payload).then(function (data) {
      if (data.data.success) {
        $('.loading-manju').loading({ destroy: true });
        app.successMsg = data.data.message;
        app.alert = 'alert alert-success';
      } else {
        $('.loading-manju').loading({ destroy: true });
        app.errorMsg = data.data.message;
        app.alert = 'alert alert-danger';
      }
      $timeout(function () {
        app.disabled = false;
        app.successMsg = undefined;
        app.errorMsg = undefined;
        app.alert = 'default';
        app.details.selectedsubject = null;
        app.details.selectedCie = null;
        app.obj = null;
      },1500);
    });
  };
}]);
