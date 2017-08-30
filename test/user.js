var expect = require('chai').expect;
var request = require('supertest');
var root_path = '../';
var app = require(root_path + 'app');
var should = require('should');

describe('User', function() {
  it('Successfully retrieve user', function(done) {
    request(app)
      .get('/users')
      .end(function(err, response) {
        var data = JSON.parse(response.text);
        // console.log(data.user);
        expect(data.user).to.equal('John Doe');
        done();
      });
  });
});
