var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
var moment = require('moment');

var userSchema = {
  userId: {
    type: String,
    required: [true, 'UserId is required.'],
    unique: true
  },
  fullname: {
    type: String,
    required: [true, 'Fullname is required.']
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true
  }
};

var UserSchema = new Schema(userSchema);
var User = mongoose.model('users', UserSchema);

var user = {
  create: function(userData) {
    return new Promise(function(resolve, reject) {
      User.create(userData)
        .then(function(result) {
          resolve(result);
        })
        .catch( /* istanbul ignore next */ function(err){
          return reject(err);
        });
    });
  }
};

module.exports = user;
