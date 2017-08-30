var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jade = require('jade');
var pug = require('pug');
var passport = require('passport');
var vhost = require('vhost');
var gulp = require('gulp');
require('./gulpfile');

var settings = require('./settings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'pug');
// app.set('view options', { layout: true });

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// Kick of gulp 'config' task, which generates angular const configuration
gulp.start('config');

// ****************************************************************************
// Configuring Passport
app.use(passport.initialize());
// app.use(passport.session());

// Initialize Passport
// var initPassport = require('./passport/init'); // long version
// initPassport(passport);
require('./passport/init')(passport); // short version
// ****************************************************************************

//Routes/Controllers for the views
// require('./routes')(app, passport);
// require('./routes')(app);

// var home = require('./routes/home');
// app.use('/', home);

var routes = require('./routes/site.controller')(app, passport);
// var users = require('./routes/users');
// var auth = require('./routes/auth');
// var api = require('./routes/api');
var middleware = require('./routes/middleware.js');

// routes
app.use('/', routes);

app.use(vhost(settings.baseURLApi, app));

var i18n = require('i18n');
i18n.configure({
  locales:['en'], //define how many languages we would support in our application
  directory: __dirname + '/locales', //define the path to language json files, default is /locales
  defaultLocale: 'en', //define the default language
  cookie: 'i18n' // define a custom cookie name to parse locale settings from
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
process.on('uncaughtException', function(err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
