angular.module('blog.controllers', []).
controller('IndexController', function($rootScope, $scope, $http, $cookies, flash, utils) {
  $scope.activeTab = 'home';
  $scope.isAuthorized = false;
  // console.log('IndexController env:', env);
  var currentUser = $cookies.getObject('user');
  var token = '';
  if ($rootScope.globalUser || (currentUser && currentUser.token)) {
    // $scope.isAuthorized = true;
    token = currentUser.token; // TODO: need to verify the token here..
  }

  $http.get('/api/post')
    .success(function(data, status, headers, config) {
      console.log('IndexController isAuthorized:',data);
      $scope.total = data.posts.length;
      $scope.posts = data.posts;
      $scope.flash = flash;
      $scope.isAuthorized = data.isAuthorized;
      if(!data.isAuthorized){
        $rootScope.globalUser = false;
      }
    })
    .error(function(data, status, headers, config) {
      $scope.isAuthorized = false;
      console.log('IndexController error:', data);
    });
}).
controller('AddNewPostController', function($rootScope, $scope, $http, $location, flash, utils, _) {
  $scope.form = {};
  $scope.activeTab = 'add';
  utils.isAuthenticated();
  // Check if user is authorized to access the page.
  // $http.get('/api/user/isauthenticated')
  //   .success(function(data, status, headers, config) {
  //     if(!data.isAuthorized){
  //       $rootScope.globalUser = false;
  //       $location.path('/login');
  //     }
  //   })
  //   .error(function(data, status, headers, config) {
  //     $scope.isAuthorized = false;
  //     $rootScope.globalUser = false;
  //     console.log('[AddNewPostController] error:', data);
  //   });

  $scope.submitPost = function() {
    $http.post('/api/post', $scope.form)
      .success(function(data, status, headers, config) {
        console.log('[AddNewPostController] submitPost:', data);
        if (data && data.success == false) {
          $scope.form.error = data.msg;
          $scope.form.formError = true;
        } else {
          flash.setMessage(data.msg);
          $location.path('/');
        }
      })
      .error(function(data, status, headers, config) {
        if (!data.success && (_.size(data.error) > 0)) {
          // var msg = '';
          // _.each(data.error, function(e){
          //   msg = msg + e.message + '<br>';
          // });
          // console.log('[AddNewPostController] err msg:',msg);
          $scope.form.formError = true;
          $scope.form.error = data.error;
        }
        console.log('[AddNewPostController] err data:',data);
        console.log('[AddNewPostController] err status:',status);
      });
  }

  $scope.doCancel = function() {
    utils.backToHome();
  };
}).
controller('EditPostController', function($rootScope, $scope, $routeParams, $http, $location, flash, utils) {
  utils.isAuthenticated();
  var id = $routeParams.id;
  console.log('[EditPostController] id:', id);
  $scope.form = {};

  $http.get('/api/post/'+id).
    success(function(data, status, headers, config) {
      $scope.form = data.posts;
      console.log('[EditPostController] $scope.form:', $scope.form);
    })
    .error(function(data, status, headers, config) {
      $scope.isAuthorized = false;
      console.log('[EditPostController] error:', data);
    });

  $scope.editPost = function() {
    console.log('[EditPostController] editPost():', $scope.form);
    $http.put('/api/post/'+id, $scope.form)
      .success(function(data, status, headers, config) {
        console.log('[EditPostController] data:', data);
        $scope.form = data.post;
        flash.setMessage(data.msg);
        $location.url('/');
      })
      .error(function(data, status, headers, config) {
        console.log('[EditPostController] editPost() data:', data);
        console.log('[EditPostController] editPost() data.error:', data.error);
        if (!data.success && data.error) {
          $scope.form.formError = true;
          if (data.error.message) {
            $rootScope.errors = data.error.message;
          } else {
            $scope.form.error = data.error;
          }
        }
      });
  }

  $scope.doCancel = function() {
    utils.backToHome();
  };
}).
controller('DeletePostController', function($rootScope, $scope, $routeParams, $http, $location, flash, utils) {
  console.log('[DeletePostController]');
  utils.isAuthenticated();
  var id = $routeParams.id;
  $http.get('/api/post/'+id).
    success(function(data, status, headers, config){
      $scope.post = data.posts;
    })
    .error(function(data, status, headers, config) {
      console.log('error:', data);
    });

  $scope.deletePost = function() {
    var id = $routeParams.id;
    $http.delete('/api/post/'+id)
      .success(function(data, status, headers, config) {
        console.log('[DeletePostController] deletePost() data:', data);
        flash.setMessage(data.msg);
        $location.url('/');
      })
      .error(function(data, status, headers, config) {
        console.log('[DeletePostController] deletePost() error:', data);
        if (!data.success && (_.size(data.error) > 0)) {
          $scope.form.formError = true;
          $scope.form.error = data.error;
          flash.setMessage(data.msg);
        }
        if (!data.success && data.message){
          // $rootScope.errors = data.message.error;
        }
      });
  };

  $scope.doCancel = function() {
    utils.backToHome();
  };
}).
controller('AuthController.login', ['$scope', '$rootScope', '$http', '$location', '$cookies', 'flash', 'appConfig',
  function($scope, $rootScope, $http, $location, $cookies, flash, appConfig) {
    $scope.data = {
      username: '',
      password: ''
    };

    if($rootScope){
      console.log('AuthController.login $rootScope.errors:',$rootScope);
    }

    $scope.doLogin = function() {
      // console.log('AuthController.login', $scope.data);
      var endpoint = appConfig.baseURLApi;
      $http.post(endpoint + '/api/v1/ui/auth', {
        username: $scope.data.username,
        password: $scope.data.password
      })
      .success(function(data, status, headers, config) {
        $scope.loading = false;
        if (data.token) {
          $location.path('/');
          $rootScope.globalUser = data;
          $cookies.putObject('user', data);
        } else {
          $scope.errors = data.message;
        }
      })
      .error(function(data, status, headers, config) {
        $scope.loading = false;
        if (data && data.errors) {
          $scope.errors = data.errors;
        } else {
          $scope.errors = ['Unknown error occurred'];
        }
      });
    }

  }]).
controller('AuthController.logout', ['$rootScope', '$scope', '$http', '$location', '$cookies', 'flash', 'appConfig',
  function($rootScope, $scope, $http, $location, $cookies, flash, appConfig){
    console.log('AuthController.logout');
    var endpoint = appConfig.baseURLApi;
    $http.get(endpoint + '/api/v1/auth/logout')
    .success(function(data, status, headers, config) {
      flash.setMessage({msg: 'Successfully logout.'});
    })
    .error(function(data, status, headers, config) {
      if (data && data.errors) {
        $scope.errors = data.errors;
      } else {
        $scope.errors = ['Unknown error occurred'];
      }
    });
    $rootScope.globalUser = null;
    $cookies.remove('user');
    $location.path('/');
}]);
