var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
var moment = require('moment');
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');

var userSchema = {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  fullname: {
    type: String,
    required: [true, 'Fullname is required.']
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    validate: [{validator: validator.isEmail, msg: 'Invalid email.'}]
  },
  passwordHash: {type: String, required: true}
};

var UserSchema = new Schema(userSchema);
var User = mongoose.model('users', UserSchema);

UserSchema.virtual('password')
.get(function() {
  return this._password;
})
.set(function(value) {
  this._password = value;
  var salt = bcrypt.genSaltSync(8);
  this.passwordHash = bcrypt.hashSync(value, salt);
  // this.passwordHash = value; // clear password
});

UserSchema.virtual('passwordConfirmation')
.get(function() {
  return this._passwordConfirmation;
})
.set(function(value) {
  this._passwordConfirmation = value;
});

UserSchema.path('passwordHash').validate(function(v) {
  if (this._password || this._passwordConfirmation) {
    if (this._password.length < 6) {
      this.invalidate('password', 'Password must be at least 6 characters.');
    }
    if (this._password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'Password does not match the confirm password.');
    }
  }

  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required.');
  }
}, null);

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
