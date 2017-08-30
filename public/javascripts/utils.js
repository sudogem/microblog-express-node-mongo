angular.module('utils.services', [])
  .factory('utils', ['$rootScope', '$location', '$http', function($rootScope, $location, $http) {
    return {
      backToHome: function(){
        $location.url('/');
      },
      isAuthenticated: function(){
        // Check if user is authorized to access the page.
        $http.get('/api/user/isauthenticated')
          .success(function(data, status, headers, config) {
            if(!data.isAuthorized){
              $rootScope.globalUser = false;
              $rootScope.errors = data.message;
              $location.path('/login');
            }
          })
          .error(function(data, status, headers, config) {
            $scope.isAuthorized = false;
            $rootScope.globalUser = false;
            console.log('[utils.services] isAuthenticated() error:', data);
          });
      }
    }
  }]);
