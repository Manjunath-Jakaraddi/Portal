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
      },1500);
    });
  };
}])
.controller('questionCtrl',['User','Teacher','$location','$scope','$timeout','$http',function (User,Teacher,$location,$timeout,$http) {
  var app=this;
  app.chatportal = {};
  app.ques = " ";
  app.answ = "  ";
  app.question_object = {};
  app.answer_object = {};
  app.question_data = {};
  app.answer_data = {};
  function getQuestions() {
    User.getQuestion().then(function (data) {
      if(data.data.success)
      {
        console.log(data.data.message);
        app.question_data=data.data.message;
      }
      else {
        console.log(data.data.message);
      }
    })
  }
  getQuestions();
  app.add_question = function(ques) {
    User.addQuestion({question: ques}).then(function (data) {
      if(!data.data.success) {
        console.log(data.data.message);
        getQuestions();
      }
    })
  };

  app.add_answer = function(answ,item) {
    User.ansQuestion({answer:answ}).then(function (data) {
      if(!data.data.success)
      {
        console.log(data.data.message);
          getQuestions();
      }
    })
}
}])
.controller('getRetailCtrl',['User','Teacher','$location','$scope','$timeout',function (User,Teacher,$location,$timeout) {
  var app = this;
  app.loading = true;
  app.accessDenied = true;
  app.errorMsg = false;
  app.editAccess = false;
  app.deleteAccess = false;
  app.limit = 10;
  app.searchLimit = 0;
  app.showbutton=true;
  function getItems() {
    app.loading = true;
      User.getitems().then(function(data) {
          if (data.data.success) {
            console.log(data.data.message);
            app.items=data.data.message;
            app.loading=false;
          } else {
              app.errorMsg = data.data.message;
              app.loading = false;
          }
      });
  };
  getItems();
  // getProds();
  //TODO getProds
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
              app.searchFilter = searchKeyword;
              app.limit = number;
          } else {
              app.searchFilter = undefined;
              app.limit = 0;
          }
      } else {
          app.searchFilter = undefined;
          app.limit = 0;
      }
  };


  app.clear = function() {
      app.number = undefined;
      app.limit = 0;
      app.searchKeyword = undefined;
      app.searchFilter = undefined;
      app.showMoreError = false;
  };
  app.saveChanges=function (data) {
    app.loading = true;
    Teacher.requestitems(data).then(function (data) {
      if (data.data.success) {
        console.log(data.data.message);
        app.items=data.data.message;
        app.loading=false;
        getItems();
      } else {
          app.errorMsg = data.data.message;
          app.loading = false;
      }
    });
  }
}]);
