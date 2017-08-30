var UserModel = require('../../models/user');

module.exports = function(app, includes) {
  var middleware = includes.middleware;

  var createUser = function(req, res) {
    console.log('[routes/api/user.js] createUser:',req.body);
    UserModel.create(req.body)
      .then(function(result) {
        console.log('[routes/api/user.js] result:',result);
        res.status(200).json(result);
      })
      .catch(function(err) {
        console.log('[routes/api/user.js] err:',err);
        res.status(404).json(err);
      });
  };

  var isAuthenticated = function(req, res) {
    console.log('[routes/api/user.js] isAuthenticated() req.error:', req.error);
    return res.json({
      isAuthorized: (req.authenticated) ? true : false,
      message: (req.error && req.error.message) ? req.error.message : 'authenticated'
    });
  }

  app.post('/api/user/create', middleware.isAuthenticated, createUser);
  app.get('/api/user/isauthenticated', middleware.isAuthenticated, isAuthenticated);
};
