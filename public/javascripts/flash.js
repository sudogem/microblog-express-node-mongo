angular.module('flash.services', [])
  .factory('flash', function($rootScope) {
    var queue = [];
    var currentMessage = "";

    $rootScope.$on("$routeChangeSuccess", function() {
      currentMessage = queue.shift() || "";
    });

    return {
      setMessage: function(message) {
        queue.push(message);
      },
      getMessage: function() {
        return currentMessage;
      }
    };
  });
