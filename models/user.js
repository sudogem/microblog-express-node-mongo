var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
var moment = require('moment');
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var settings = require('../settings');

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
  passwordHash: {
    type: String,
    required: [true, 'Password is required.']
  },
  articles: [{type: Schema.Types.ObjectId, ref: 'posts'}]
};

var UserSchema = new Schema(userSchema);
var User = mongoose.model('users', UserSchema);

UserSchema.virtual('password')
.get(function() {
  return this._password;
})
.set(function(value) {
  this._password = value;
  // var salt = bcrypt.genSaltSync(8); // random generated salt
  var salt = settings.userSaltKey;
  this.passwordHash = bcrypt.hashSync(value, salt);
  // this.passwordHash = value; // for unencrypted password
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
      User.findOne({email: userData.email})
        .then(function(result) {
          console.log('User.create result:',result);
          if (result) {
            resolve(false);
          } else {
            User.create(userData)
              .then(function(result) {
                resolve(result);
              })
              .catch( /* istanbul ignore next */ function(err){
                return reject(err);
              });
          }
        })
        .catch( /* istanbul ignore next */ function(err){
          return reject(err);
        });
    });
  },

  find: function(userData) {
    return new Promise(function(resolve, reject) {
      var salt = settings.userSaltKey;
      var passwordHash = bcrypt.hashSync(userData.password, salt);
      User.findOne({'email': userData.email, 'passwordHash': passwordHash})
        .then(function(result) {
          console.log('User.find result:',result);
          if (result) {
            resolve(result);
          } else {
            resolve(false);
          }
        })
        .catch( /* istanbul ignore next */ function(err){
          console.log('User.find err:',err);
          return reject(err);
        });
    });
  },

  findById: function(id) {
    return new Promise(function(resolve, reject) {
      console.log('User.findById id:',id);
      User.findOne({_id: id})
        .then(function(result){
          console.log('User.findById result:',result);
          resolve(result);
        })
        .catch( /* istanbul ignore next */ function(err){
          console.log('User.findById err:',err);
          return reject(err);
        });
    });
  },

  updateArticles: function(authorId, postId) {
    return new Promise(function(resolve, reject) {
      User.findOne({_id: authorId}, function(err, user) {
        if (user) {
          user.articles.push(postId);
          user.save(function(result) {
            console.log('\n[models/user.js] updateArticles() Successfully saved...');
            resolve(result);
          });
        } else {
          console.log('\n[models/user.js] updateArticles() err:',err);
          return reject(err);
        }
      });
    });
  }
};

module.exports = user;
