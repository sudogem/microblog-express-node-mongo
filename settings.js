var mongoDbURL;
var baseURLApi;
var nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'development') {
  mongoDbURL = process.env.MONGODB_URL_DEV;
  if (!mongoDbURL) {
    process.env['MONGODB_URL_DEV'] = 'mongodb://localhost/microblog-express-node-db';
  }
  mongoDbURL = process.env.MONGODB_URL_DEV;
  baseURLApi = process.env.BASEURL_API_DEV;
  if (!baseURLApi) {
    process.env['BASEURL_API_DEV'] = 'http://local.microblog2.com';
  }
} else {
  mongoDbURL = process.env.MONGODB_URL_PROD;
  baseURLApi = process.env.OPENSHIFT_APP_DNS || process.env.BASEURL_API_PROD;
  if (!baseURLApi) {
    process.env['BASEURL_API_PROD'] = 'http://local.microblog2.com';
  }
}

module.exports = {
	mongoDbURL: mongoDbURL || 'mongodb://localhost/microblog-express-node-db',
  baseURLApi: baseURLApi || '//local.microblog2.com',
  JWTTokenSecret: process.env.JWT_TOKEN_SECRET || '91fe211053c6377ddfd218a061f96',
  userSaltKey: process.env.USER_SALT_KEY || '$2a$08$AIqmMQHjc/5/Nz7hOWMHNu'
};

console.log('module.exports:',module.exports);
// var loggers = require('./middleware/logger');
var mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

if (module.exports.mongoDbURL && module.exports.mongoDbURL != '') {
  var mongoOptions = {
    'server': {
      'socketOptions': {
        'keepAlive': 300000,
        'connectTimeoutMS': 60000
      }
    },
    'replset': {
      'socketOptions': {
        'keepAlive': 300000,
        'connectTimeoutMS' : 60000
      }
    }
  };
  mongoose.connect(module.exports.mongoDbURL, mongoOptions);
  // loggers.get('init').info('Connecting to mongoDB');
  console.log('Connecting to mongoDB:', module.exports.mongoDbURL);
  module.exports.mongoose = mongoose;
}
else {
  // Stub-out so we don't get errors
  module.exports.mongoose = {
    model: function() {},
    schema: ''
  };
}
