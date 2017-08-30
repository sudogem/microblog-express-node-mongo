// Place our middleware here
var config = require('../settings');
var jwt = require('jwt-simple');
var moment = require('moment');

exports.checkHeaderToken = function(req, res, next) {
  var token = req.headers['x-auth-token'];
  console.log('[routes/middleware.js] exports.checkHeaderToken() token:',req.get('Authorization'));
  if (!token) {
    res.status(401).json({
      'success': false,
      'error': 'Not authorized - No access token'
    });
    return;
  }
  try {
    var decoded = jwt.decode(token, config.JWTTokenSecret);
    console.log('[routes/middleware.js] exports.checkHeaderToken() iss:',decoded.iss);
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
    // console.log('[routes/middleware.js] exports.checkHeaderToken() expiry:',moment(decoded.exp).format("DD MMM YYYY hh:mm a"));
    // if (decoded.exp <= Date.now()) {
    //   return res.status(401).json({'error': 'Access token has expired'});
    // }
    // if (decoded.iss === 123456789) { //request from ui
    //   req.user = decoded;
    //   return next();
    // } else {
    //   res.status(401).json({'error': 'Unauthorized - User is not valid'});
    //   return;
    // }
    // users.get_one(decoded.iss, function(err, user) {
    // });
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
  req.authenticated = false;
  if (!token) {
    return next();
  }
  if (token) {
    var decoded = jwt.decode(token, config.JWTTokenSecret);
    verifyUser(decoded, function(err, result) {
      if (err) {
        console.log('[routes/middleware.js] exports.isAuthenticated() err:',err);
        req.user = null;
        req.error = err; // pass the error to the next request..
        return;
      }
      if (result) {
        req.user = decoded;
        req.authenticated = true;
      }
    });
    console.log('[routes/middleware.js] exports.isAuthenticated() req.authenticated:',req.authenticated);
    console.log('[routes/middleware.js] exports.isAuthenticated() expiry:',moment(decoded.exp).format("DD MMM YYYY hh:mm:ss a"));
    return next();
  }
}

function verifyUser(decoded, cb) {
  if (decoded) {
    try {
      if (decoded.exp <= Date.now()) {
        return cb({'message': 'Your session has expired. Please log in again.'});
      }
      if (decoded.iss === 123456789) { //request from ui
        // req.user = decoded;
        return cb(null, true);
      } else {
        return cb({'message': 'Unauthorized - User is not valid'});
      }
    } catch (e) {
      return cb({'message': e});
    }
  }
}
