angular.module('abort', [])
  .factory('abort-request', ['$rootScope', '$q', function($rootScope, $q){
    var removeListener;
    return {
      request: function(config) {
        console.log('abort-request...');
        var deferred = $q.defer();
        // Generate a callback function for storing deferred object.
        var callback = function(defer) {
          var defer = defer;
          return function() {
            defer.resolve();
          };
        };

        // Do not remove this, it will cause template loading to fail.
        // if (config.url.match(/\/api\//)) {
        //   config.timeout = deferred.promise;
        // } else {
        //   config.timeout = 0;
        // }
        config.timeout = 0;
        if (removeListener) {
          removeListener();
        }

        var deferCallback = callback(deferred);
        removeListener = $rootScope.$on('$routeChangeStart', function(event) {
          deferCallback(deferred);
        });

        return config;
      }
    };
  }]);
