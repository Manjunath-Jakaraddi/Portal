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
    app.options = [{value: 'admin',label: 'admin'},{value: 'user',label: 'user'},{value: 'retailer', label: 'retailer'}];

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
}])

.controller('viewCtrl',['User','$scope','$timeout',function (User,$scope,$timeout) {
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
}])
.controller('influencerCtrl',['User','$scope','$timeout','$http',function (User,$scope,$timeout,$http) {
  var app=this;
  app.hash = " ";
app.cit = " ";
app.get_influencers = function(hash,cit){
  console.log(hash,cit);
app.influs= [];
app.profile_image = "http://profilepicturesdp.com/wp-content/uploads/2018/06/default-user-profile-picture-6.png";
  $http({
    url: '/api/get_influencers',
    method: 'post',
    data: {hashtag:hash,city:cit}
  }).then(function(data){
    if(data.data.success){
      // alert("Receieved influncers");
      app.influs = data.data.reason;
  }
  else {
    alert(data.data.reason);
  }
  },function(err){
    alert("Failed to add");
  })

}
}])
.controller('itemsCtrl', ['User','$scope','$timeout',function(User, $scope, $timeout) {
    var app = this;

    app.loading = true;
    app.accessDenied = true;
    app.errorMsg = false;
    app.editAccess = false;
    app.deleteAccess = false;
    app.limit = 10;
    app.searchLimit = 0;
    app.options = [{value: 'admin',label: 'admin'},{value: 'user',label: 'user'},{value: 'retailer', label: 'retailer'}];

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
    app.createitem = function (itemdata,valid) {
      User.additems(app.itemData).then(function (data) {
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
      })
    };
}]);
