var express = require('express');
var router = express.Router();
var app = express();
var btoa = require('btoa');
var rest = require('restler');
var extend = require('util')._extend;
var middleware = require('./middleware.js');
var fs = require('fs');
var settings = require('../settings');

/**
 * Site controllers for routes that doesn't fit to other components
 */
module.exports = function(app, passport){
  var render = function(req, res, file, json) {
    json['siteTitle'] = 'Blog app';
    json['user'] = req.session.user;
    json['userEmail'] = req.user;
    return res.render(file, json);
  };

  var includes = {
    render: render,
    middleware: middleware
  };

  fs.readdirSync('./routes/api').forEach(function(file) {
    console.log('Successfully loaded route api/'+file);
    require('./api/' + file)(app, includes);
  });

  /* GET home page. */
  router.get('/', function(req, res, next) {
    console.log('------------------------------------------');
    console.log('[site.controller.js] [/] req.authenticated:',req.authenticated);
    res.render('index', {
      title: 'AngularJS app',
      isAuthorized: (req.authenticated) ? true : false,
      description: 'Built using AngularJS 1.x, Pug, ExpressJS & MongoDB. Deployed to Openshift'
    });
  });

  // lets render the jade file into HTML
  router.get('/partials/:name', middleware.isAuthenticated, function(req, res) {
    var name = req.params.name;
    console.log('[site.controller.js] [/partials/:name] req.authenticated:',req.authenticated);
    res.render('partials/' + name, {
      isAuthorized: (req.authenticated) ? true : false
    });
  });

  router.get('/api/v1/auth/loginform', function(req, res, next) {
    console.log('render login form...');
    res.render('auth/login');
  });

  /* Api auth */
  router.post('/api/v1/auth', passport.authenticate('api_login', {session: false}),
    function(req, res){
      // console.log('auth req.user:', req.user);
      // req.headers.authorization = req.user['token'];
      res.json(req.user);
    });

  /* Handle auth for browser */
  router.post('/api/v1/ui/auth', function(req, res) {
    var authdata = btoa(req.body.username + ':' + req.body.password);
    var host = req.headers.host;
    var protocol = (req.secure) ? 'https://' : 'http://';
    var auth_url = protocol + host + '/api/v1/auth';
    console.log(' ');
    console.log('===================================================================');
    console.log('Checking authentication status...');
    console.log('Date:', new Date());
    console.log('Host:', host);
    console.log('is_SSL:', req.secure);
    console.log('Auth_url:', auth_url);
    console.log('env:', app.get('env'));
    console.log('===================================================================');
    rest.post(auth_url, {
      headers: {'Authorization': 'Basic ' + authdata}
    })
    .on('fail', function(data, response){
      console.log('auth onFail:',data);
      res.json({message: data});
    })
    .on('error', function(err, response){
      console.log('auth onError:',err);
    })
    .on('success', function(data) {
      console.log('auth onSuccess:',data);
      // data = extend(data);
      res.json(data);
    });
  });

  router.get('/api/v1/auth/logout',
    function(req, res){
      console.log('logout....');
      res.redirect('/');
      req.logout();
    });

  return router;
};
