var expect = require('chai').expect;
var request = require('supertest');
var root_path = '../';
var app = require(root_path + 'app');
var should = require('should');

describe('Api', function() {
  it('Successfully retrieve post data', function(done) {
    request(app)
      .get('/posts')
      .end(function(err, response) {
        var data = JSON.parse(response.text);
        // console.log(data.posts);
        // console.log(data.posts[0].title);
        expect(data.posts).to.have.length(4);
        expect(data.posts).to.be.an('array');
        expect(data.posts[0]).to.have.property('title');
        expect(data.posts[0].title).to.equal('Lorem ipsum');
        done();
      });
  });

  it('Successfully update a post', function(done){
    var newdata = {title: 'updated title', text: 'updated body'};
    request(app)
      .put('/posts/1')
      .send({body: newdata})
      .end(function(err, response) {
        var data = JSON.parse(response.text);
        expect(data.msg).to.equal('Successfully updated post.');
        done();
      });
  });

  it('Should return Post not Found', function(done){
    var newdata = {title: 'updated title', text: 'updated body'};
    request(app)
      .put('/posts/100')
      .send({body: newdata})
      .end(function(err, response) {
        var data = JSON.parse(response.text);
        // console.log(data);
        expect(data.msg).to.equal('Post not Found.');
        done();
      });
  });

});
