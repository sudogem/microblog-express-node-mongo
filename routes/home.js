var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express', layout:false });
  var posts = [];
  res.render('index');
});

// lets render the jade file into HTML
router.get('/partials/:name', function(req, res) { 
  var name = req.params.name;
  res.render('partials/' + name);
});

module.exports = router;
