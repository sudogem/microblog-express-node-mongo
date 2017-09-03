var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
var moment = require('moment');
var validator = require('validator');
var Validator = require('validator').Validator;
var val = new Validator();

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
    unique: true,
    validate: [{validator: validator.isEmail, msg: 'Invalid email'}]
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
  // var salt = bcrypt.gen_salt_sync(12);
  // this.passwordHash = bcrypt.encrypt_sync(value, salt);
  this.passwordHash = value;
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
    if (!val.check(this._password).min(6)) {
      this.invalidate('password', 'must be at least 6 characters.');
    }
    if (this._password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'must match confirmation.');
    }
  }

  if (this.isNew && !this._password) {
    this.invalidate('password', 'required');
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
