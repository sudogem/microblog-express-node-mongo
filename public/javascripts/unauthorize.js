angular.module('app')
  .factory('unauthorize', ['$location', '$q', function($location, $q){
    return {
      responseError: function(response) {
        var deferred = $q.defer();
        console.log('Factory.unauthorize:',response.status);
        if (response.status == 403 || response.status == 401) {
          $location.path('/login');
        }
        deferred.reject(response);
        return deferred.promise;
      }
   };
  }]);
