'use strict';

var app = angular.module('app', [
  'app.config',
  'blog.controllers',
  'flash.services',
  'utils.services',
  'ngRoute',
  'ngCookies',
  'abort',
  'underscore'
]);

app.run(['$rootScope', '$window', '$cookies', '$location',
  function($rootScope, $window, $cookies, $location) {
    var currentUser = $cookies.getObject('user');
    console.log('rootScope user:',currentUser);
    if (currentUser) {
      $rootScope.globalUser = currentUser;
    }
    // Prevent unauthenticated user from accessing protected route
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      var currentUser = $cookies.getObject('user');
      console.log('$routeChangeStart next:', next.$$route);
      // console.log('$rootScope.globalUser=', $rootScope.globalUser);
      var allowed = true;
      if (!$rootScope.globalUser) {
        if ($rootScope.errors)
          $rootScope.errors = '';
        if (!next.$$route.public) {
          allowed = false;
        }
      } else if (!$rootScope.globalUser.admin && (next.$$route &&next.$$route.admin)) {
        allowed = false;
      }
      if (!allowed) {
        event.preventDefault();
        $location.path('/login');
      }
    });

    $rootScope.$on('$routeChangeError', function(event, next, current) {
      $location.path('/');
    });
}])
.filter('unsafe', function($sce) { /* render the data in raw html format(unescape strings) */
  return $sce.trustAsHtml;
})
.config(['$httpProvider', function($httpProvider) {
  // Automatically inject user token to HTTP header
  $httpProvider.interceptors.push('authorize');
  // Automatically inject user token to HTTP header
  $httpProvider.interceptors.push('unauthorize');
  // Automatically cancel http request on route change
  // $httpProvider.interceptors.push('abort-request');
}])
.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/posts', { controller: 'IndexController', templateUrl: 'partials/index', public: true})
      .when('/add', { controller: 'AddNewPostController', templateUrl: 'partials/add_new_post', public: false})
      .when('/edit_post/:id', { controller: 'EditPostController', templateUrl: 'partials/edit_post', public: false})
      .when('/delete_post/:id', { controller: 'DeletePostController', templateUrl: 'partials/delete_post', public: false})
      .when('/login', { controller: 'AuthController.login', templateUrl: 'api/v1/auth/loginform', public: true})
      .when('/logout', { controller: 'AuthController.logout', template: ''})
      .when('/', {
        public: true,
        redirectTo: '/posts'
      });

      $routeProvider.otherwise({
        redirectTo: '/posts'
      });
    // remove hashes from location URL
    // $locationProvider.html5Mode(true);
}]);
