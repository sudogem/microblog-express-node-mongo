var mongoDbURL;
var baseURLApi;
var nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'development') {
  // Note: You can use docker based mongodb here
  // URL: mongodb://{docker-host-ip}:{docker-host-port}/microblog-express-node-mongodb
  // E.g., mongodb://192.168.99.100:27017/microblog-express-node-mongodb
  mongoDbURL = process.env.MONGODB_URL_DEV;
  if (!mongoDbURL) {
    process.env['MONGODB_URL_DEV'] = 'mongodb://localhost/microblog-express-node-db';
  }
  mongoDbURL = process.env.MONGODB_URL_DEV;
  baseURLApi = process.env.BASEURL_API_DEV;
  if (!baseURLApi) {
    process.env['BASEURL_API_DEV'] = 'http://localhost:4001';
  }
} else {
  mongoDbURL = process.env.MONGODB_URL_PROD;
  baseURLApi = process.env.OPENSHIFT_APP_DNS || process.env.BASEURL_API_PROD;
  if (!baseURLApi) {
    process.env['BASEURL_API_PROD'] = 'http://localhost:4001';
  }
}

module.exports = {
  mongoDbURL: mongoDbURL || 'mongodb://localhost/microblog-express-node-db',
  baseURLApi: baseURLApi || 'http://localhost:4001',
  JWTTokenSecret: process.env.JWT_TOKEN_SECRET || '91fe211053c6377ddfd218a061f96',
  userSaltKey: process.env.USER_SALT_KEY || '$2a$08$AIqmMQHjc/5/Nz7hOWMHNu',
  siteName: 'AngularJS 1 Blog',
  siteDescription: 'Built using AngularJS 1.x, Pug, ExpressJS & MongoDB. Deployed to Openshift'
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
