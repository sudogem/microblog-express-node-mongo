var mongoDbURL;
var baseURLApi;
var nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'development') {
  mongoDbURL = process.env.mongoDB_URL_DEV;
  if (!mongoDbURL) {
    process.env['mongoDB_URL_DEV'] = 'mongodb://localhost/microblog-express-node-db';
  }
  mongoDbURL = process.env.mongoDB_URL_DEV;
  baseURLApi = process.env.baseURL_API_DEV;
  if (!baseURLApi) {
    process.env['baseURL_API_DEV'] = '//local.microblog2.com';
  }
} else {
  mongoDbURL = process.env.mongoDB_URL_PROD;
  baseURLApi = process.env.OPENSHIFT_APP_DNS || process.env.baseURL_API_PROD;
  if (!baseURLApi) {
    process.env['baseURL_API_PROD'] = '//local.microblog2.com';
  }
}

module.exports = {
	mongoDbURL: mongoDbURL || 'mongodb://localhost/microblog-express-node-db',
  baseURLApi:  baseURLApi || '//local.microblog2.com',
  JWTTokenSecret: process.env.JWTTokenSecret || '91fe211053c6377ddfd218a061f96'
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
