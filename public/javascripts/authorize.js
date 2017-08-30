angular.module('app')
  .factory('authorize', ['$rootScope', function($rootScope){
   return {
     request: function(config){
       if ($rootScope.globalUser) {
        config.headers['x-auth-token'] = $rootScope.globalUser.token;
        config.headers['x-auth-email'] = 'test@mail.com';
      }
      return config;
    }
   };
  }]);
