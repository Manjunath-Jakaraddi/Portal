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
}])
.controller('getRetailctrl',['User','$scope','$timeout','Student','$location',function (User,$sccope,$timeout,Student,$location) {
  var app = this;
  app.loading = true;
  app.accessDenied = true;
  app.errorMsg = false;
  app.editAccess = false;
  app.deleteAccess = false;
  app.limit = 10;
  app.searchLimit = 0;
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
  app.manju="asdfaS";
  app.navigate=function(data) {
    app.loading=true;
    User.navigate(data).then(function (data) {
      if(data.data.success) {
        console.log(data.data.message);
        app.retailers = data.data.message;
      } else {
        app.errorMsg = data.data.message;
        app.loading = false;
      }
    })
  };

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
}]);
