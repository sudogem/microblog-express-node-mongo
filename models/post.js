var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
var moment = require('moment');
var i18n = require('i18n');
var _ = require('underscore');
var UserModel = require('./user');

var postSchema = {
  title: {
    type: String,
    required: [true, 'Post title is required.'], // wont work! i18n.__('PostTitleRequired')
  },
  body: {
    type: String,
    required: [true, 'Post body is required.'], // i18n.__('PostBodyRequired')
  },
  author: {type: Schema.Types.ObjectId, ref: 'users'}
}

var PostSchema = new Schema(postSchema, { timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'} });
var Post = mongoose.model('posts', PostSchema);

var post = {
  create: function(postData) {
    return new Promise(function(resolve, reject) {
      // return Post.create(postData); // invalid calling
      console.log('\n[models/posts.js] create() postData:',postData);
      Post.create(postData)
        .then(function(result) {
          console.log('\n[models/posts.js] create() result:',result);
          UserModel.updateArticles(postData.author, result._id)
            .then(function(result) {
              console.log('\n[models/posts.js] create() User.findByIdAndUpdate result:',result);
              resolve(result);
            })
            .catch(function(err){
              console.log('\n[models/posts.js] create() User.findByIdAndUpdate err:',err);
              return reject(err);
            });
          // resolve(result);
        })
        .catch(function(err){
          console.log('\n[models/posts.js] create() err:',err);
          return reject(err);
        });
    });
  },
  update: function(data) {
    return new Promise(function(resolve, reject) {
      var postId = data._id;
      if (!postId) {
        return reject({'error': i18n.__('PostIdRequired')});
      }
      data.updated_at = new Date(moment.utc());
      Post.findByIdAndUpdate({'_id': postId}, {'$set': data}, {new:true, runValidators: true}).exec()
        .then(function(result) {
          resolve(result);
        })
        .catch(function(err){
          return reject(err);
        });
    });
  },
  delete: function(postId) {
    return new Promise(function(resolve, reject) {
      if (!postId) {
        return reject({'error': i18n.__('PostIdRequired')});
      }
      Post.findByIdAndRemove(postId)
        .then(function(result) {
          console.log('postId:',postId,'\n', result);
          resolve(result);
        })
        .catch(function(err){
          return reject(err);
        });

      // same as findByIdAndRemove()
      // Post.findByIdAndRemove(postId)
      //   .exec()
      //   .then(function(result) {
      //     console.log('postId:',postId,'\n', result);
      //     resolve(result);
      //   })
      //   .catch(function(err){
      //     return reject(err);
      //   });

      // return success=true whether the record exist or not
      // Post.remove({_id: postId}, function(err, cb) {
      //   if (err) {
      //     return reject(err);
      //   } else {
      //     console.log('cb:',cb)
      //     console.log('postId:',postId,'\n');
      //     resolve({'success':true});
      //   }
      // });

    });
  },
  get: function(postId) {
    return new Promise(function(resolve, reject) {
      if (postId) {
        Post.findOne({_id: postId}).exec()
          .then(function(result) {
            resolve(result);
          })
          .catch(function(err){
            return reject(err);
          });
      } else {
        // Here we populate our post author http://mongoosejs.com/docs/populate.html
        Post.find().sort({'updated_at': -1})
          .populate('author')
          .exec()
          .then(function(result){
            var newResult = [];
            _.each(result, function(item){
              var obj = {
                _id: item._id,
                title: item.title,
                body: item.body,
                author: item.author.fullname,
                created_at: moment(item.created_at).format("ddd, MMMM D YYYY, h:mm:ss A"),
                updated_at: moment(item.updated_at).format("ddd, MMMM D YYYY, h:mm:ss A")
              };
              newResult.push(obj);
            });
            resolve(newResult);
          })
          .catch(function(err){
            reject({'error':err});
          });
      }
    });
  }
};

module.exports = post;
