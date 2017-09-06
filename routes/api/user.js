var UserModel = require('../../models/user');

module.exports = function(app, includes) {
  var middleware = includes.middleware;

  var createUser = function(req, res) {
    var userData;
    try {
      userData = JSON.parse(req.body.user);
      console.log('[routes/api/user.js] createUser():',userData);
    } catch(e) {
      userData = req.body.user;
      console.log('[routes/api/user.js] createUser() err:',userData);
    }
    UserModel.create(userData)
      .then(function(result) {
        if (result === false) {
          res.status(200).json({errors: {'duplicateUser': {'message': 'Account already exist in database. Please try a new one.'}}});
        } else {
          res.status(200).json(result);
        }
        console.log('[routes/api/user.js] createUser() result:',result);
      })
      .catch(function(err) {
        console.log('[routes/api/user.js] createUser() err:',err);
        res.status(404).json(err);
      });
  };

  var isAuthenticated = function(req, res) {
    if (req.error) console.log('[routes/api/user.js] isAuthenticated() req.error:', req.error);
    return res.json({
      isAuthorized: (req.authenticated) ? true : false,
      message: (req.error && req.error.message) ? req.error.message : 'authenticated'
    });
  }

  app.post('/api/user/create', createUser);
  app.get('/api/user/isauthenticated', middleware.isAuthenticated, isAuthenticated);
};
