'use strict';

var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');
var settings = require('./settings');
var configureSetup;

var nodeEnv = process.env.NODE_ENV || 'development';
console.log('nodeEnv:',nodeEnv);

// Note: angular constants namespace issue
// https://stackoverflow.com/questions/27828433/how-do-you-manage-conflicts-when-items-in-dependencies-have-the-same-name
switch(nodeEnv) {
  case 'development':
    configureSetup  = {
      constants: {
        appConfig: {
          common: {
            version: '1.0',
            appName: 'microblog-express-node',
            JWTTokenSecret: process.env.JWTTokenSecret || '91fe211053c6377ddfd218a061f96'
          },
          baseURLApi: process.env.baseURL_API_DEV,
          siteName: 'Microblog-Node (DEV)'
        }
      }
    }
    break;
  case 'production':
    configureSetup  = {
      constants: {
        appConfig: {
          common: {
            version: '1.0',
            appName: 'microblog-express-node',
            JWTTokenSecret: process.env.JWTTokenSecret || '91fe211053c6377ddfd218a061f96',
          },
          baseURLApi: process.env.baseURL_API_PROD,
          siteName: 'Microblog-Node (PROD)'
        }
      }
    }
    break;
}

var makeConfig = function() {
  return gulp.src('settings.json')
             .pipe(gulpNgConfig('app.config', configureSetup))
             .pipe(gulp.dest('public/javascripts'));
}

gulp.task('config', function() {
  makeConfig();
});
