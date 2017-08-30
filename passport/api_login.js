var BasicStrategy   = require('passport-http').BasicStrategy;
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../settings');

module.exports = function(passport) {
  passport.use('api_login', new BasicStrategy(
    function(username, password, done) {
      validateAuth(username, password, function(err, result) {
        /* istanbul ignore next */
        if (err) {
          console.log('[passport/api_login.js] validateAuth err:', err);
          return done(null, err);
        } else {
          authenticate({
            email: username,
            passw: password,
            _id: 123456789
          }, done);
          return;
        }
        // if (username === 'user@mail.com' && password === 'test') {
        //   authenticate({
        //     email: username,
        //     passw: password,
        //     _id: 123456789
        //   }, done);
        // } else {
        //   return done(null, {'message': 'Invalid username/password. Please try again!'});
        // }
      });
    }
  ));

  var validateAuth = function(username, password, done) {
    console.log('username:',username);
    console.log('pass:',password);
    if (username == '' || password == '') {
      return done({'message': 'Please enter your username/password.'});
    }
    if (username === 'user@mail.com' && password === 'test') {
      return done(null, username);
    } else {
      return done({'message': 'Invalid username/password. Please try again!'});
    }
  }

  var authenticate = function(user, done) {
    return done(null, createUserToken(user));
  };

  // create user jwt token
  var createUserToken = function(user) {
    var expires = moment().add(5, 'seconds').valueOf();
    var payload = {
      iss: user._id,
      exp: expires,
    };

    if (user['is_admin'] === true) {
      payload.admin = true;
    }

    var token = jwt.encode(payload, config.JWTTokenSecret);
    var email = user.email || '';
    email = email.toLowerCase().trim();

    var response = {
      token: token,
      expires: expires,
      user: email
    };

    if (user['first_login'] === true) {
      response.welcome = true;
    }

    if (user['is_admin'] === true) {
      response.admin = true;
    }
    // console.log('createUserToken:',response);
    return response;
  };
};
