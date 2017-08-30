var fs = require('fs');
var settings = require('../settings');

var render = function(req, res, file, json) {
  json['siteTitle'] = 'Blog app';
  json['user'] = req.session.user;
  json['userEmail'] = req.user;
  return res.render(file, json);
};

module.exports = function(app) {
  var includes = {
    render: render
  };

  fs.readdirSync('./routes/api').forEach(function(file) {
    console.log('Successfully loaded route api/'+file);
    require('./api/' + file)(app, includes);
  });
};
