// Place our middleware here
var config = require('../settings');
var jwt = require('jwt-simple');
var moment = require('moment');
var UserModel = require('../models/user');

exports.checkHeaderToken = function(req, res, next) {
  var token = req.headers['x-auth-token'];
  // console.log('\n[routes/middleware.js] exports.checkHeaderToken() token:',token);
  if (!token) {
    res.status(401).json({
      'success': false,
      'error': 'Not authorized - No access token'
    });
    return;
  }
  try {
    var decoded = jwt.decode(token, config.JWTTokenSecret);
    console.log('\n[routes/middleware.js] exports.checkHeaderToken() iss:',decoded.iss);
    verifyUser(decoded, function(err, result) {
      if (err) {
        res.status(401).json({
          'success': false,
          'error': err
        });
        return;
      }
      if (result) {
        req.user = decoded;
        req.authenticated = true;
        return next();
      }
    });
  } catch (e) {
    res.status(500).json({
      'success': false,
      'error': 'Error during token decoding'
    });
    return;
  };
};

exports.isAuthenticated = function(req, res, next) {
  var token = req.headers['x-auth-token'];
  console.log('\n[routes/middleware.js] exports.isAuthenticated() token:',token);
  req.authenticated = false;
  if (!token) {
    return next();
  }
  if (token) {
    var decoded = jwt.decode(token, config.JWTTokenSecret);
    verifyUser(decoded, function(err, result) {
      if (err) {
        console.log('\n[routes/middleware.js] exports.isAuthenticated() err:',err);
        req.user = null;
        req.error = err; // pass the error to the next request..
        return next();
      }
      if (result) {
        console.log('\n[routes/middleware.js] exports.isAuthenticated() result:',result);
        req.user = decoded;
        req.authenticated = true;
        console.log('\n[routes/middleware.js] exports.isAuthenticated() req.authenticated:',req.authenticated);
        console.log('\n[routes/middleware.js] exports.isAuthenticated() expiry:',moment(decoded.exp).format("DD MMM YYYY hh:mm:ss a"));
        return next();
      }
    });
  }
}

function verifyUser(decoded, cb) {
  if (decoded) {
    try {
      if (decoded.exp <= Date.now()) {
        return cb({'message': 'Your session has expired. Please log in again.'});
      }

      UserModel.findById(decoded.iss)
        .then(function(result) {
          // console.log('\n[routes/middleware.js] verifyUser() result:',result);
          return cb(null, true);
        })
        .catch(function(err) {
          // console.log('\n[routes/middleware.js] verifyUser() err:',err);
          return cb({'message': 'Unauthorized - User is not valid'});
        });
      // if (decoded.iss === 123456789) { //request from ui
      //   // req.user = decoded;
      //   return cb(null, true);
      // } else {
      //   return cb({'message': 'Unauthorized - User is not valid'});
      // }
    } catch (e) {
      return cb({'message': e});
    }
  }
}
