var PostModel = require('../../models/post');
var i18n = require('i18n');

module.exports = function(app, includes) {
  var middleware = includes.middleware;

  createPost = function(req, res) {
    console.log('[routes/api/post.js] createPost():',req.body);
    PostModel.create(req.body)
      .then(function(result) {
        console.log('[routes/api/post.js] createPost() result:',result);
        var result = {'success':true, 'post': result};
        res.status(200).json(result);
      })
      .catch(function(err) {
        console.log('[routes/api/post.js] createPost() err:',err.errors);
        var result = {'success': false, 'error': err.errors};
        res.status(400).json(result);
      });
  };

  getAllPosts = function(req, res){
    PostModel.get()
      .then(function(result){
        console.log('[routes/api/post.js] getPost() result:',result);
        res.json({
          'isAuthorized': (req.authenticated) ? true : false,
          'posts': result
        });
      })
      .catch(function(err){
        console.log('[routes/api/post.js] getPost() err:',err);
        res.status(500).json(err);
      });
  };

  getPost = function(req, res) {
    var id = req.params.id;
    PostModel.get(id)
      .then(function(result){
        if(id) console.log('[routes/api/post.js] id:',id);
        console.log('[routes/api/post.js] getPost() result:',result);
        res.json({
          'isAuthorized': (req.authenticated) ? true : false,
          'posts': result
        });
      })
      .catch(function(err){
        console.log('[routes/api/post.js] getPost() err:',err);
        res.status(500).json(err);
      });
  };

  updatePost = function(req, res) {
    var postId = req.body._id;
    console.log('[routes/api/post.js] updatePost() req.body:',req.body);
    if (!postId) {
      return res.status(404).json({'success': false, 'error': i18n.__('PostIdRequired')});
    }
    PostModel.update(req.body)
      .then(function(result){
        console.log('[routes/api/post.js] updatePost() result:',result);
        res.status(200).json({'success': true, 'posts': result});
      })
      .catch(function(err){
        console.log('[routes/api/post.js] updatePost() err:',err.errors);
        var result = {'success': false, 'error': (err && err.errors ? err.errors: err)};
        res.status(500).json(result);
      });
  };

  deletePost = function(req, res) {
    var postId = req.params.id;
    if (!postId) {
      return res.status(400).json({'success': false, 'error': i18n.__('PostIdRequired')});
    }
    PostModel.delete(postId)
      .then(function(result){
        console.log('[routes/api/post.js] deletePost result:',result);
        if (result === null) {
          return res.status(404).json({'success': false, 'error': i18n.__('PostNotFound')});
        }
        res.status(200).json(result);
      })
      .catch(function(err){
        console.log('[routes/api/post.js] deletePost err:',err);
        res.status(500).json(err);
      });
  };

  app.get('/api/post', middleware.isAuthenticated, getAllPosts);
  app.get('/api/post/:id?', middleware.checkHeaderToken, getPost);
  app.post('/api/post', middleware.checkHeaderToken, createPost);
  app.put('/api/post/:id?', middleware.checkHeaderToken, updatePost);
  app.delete('/api/post/:id', middleware.checkHeaderToken, deletePost);
};
