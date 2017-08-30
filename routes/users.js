var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    isAuthorized: (req.authenticated) ? true : false
  });
});

module.exports = router;
