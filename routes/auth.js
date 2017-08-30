var express = require('express');
var router = express.Router();

router.get('/loginform', function(req, res, next) {
  var posts = [];
  console.log('auth/loginform..');
  res.render('login');
});

module.exports = router;
