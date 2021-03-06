var assert = require('assert');
var request = require('supertest');

describe('User Controller', function () {

  describe('#create()', function () {

    it ('should be able to create new user', function (done) {

      request(sails.hooks.http.app)
        .post('/register')
        .send({
          email: 'new.user@email.com',
          password: 'admin1234'
        })
        .expect(200)
        .end(function(err) {
          done(err);
        });

    });

    it ('should return error if user already exists', function (done) {

      request(sails.hooks.http.app)
        .post('/register')
        .send({
          email: 'new.user@email.com',
          password: 'admin1234'
        })
        .expect(500)
        .end(function(err) {
          done(err);
        });

    });

  });

  describe('#findOne()', function () {

    var userId;

    it ('should find user if they have been authenticated', function (done) {

    var agent = request.agent(sails.hooks.http.app);

    agent
      .post('/auth/local')
      .send({
        identifier: 'existing.user@email.com',
        password: 'admin1234'
      })
      .expect(200, function (err, res) {

      if (err)
        return done(err);

      agent.saveCookies(res);

      userId = res.body.id;

      agent
        .get('/user/' + userId)
        .expect(200)
        .end(function (err) {
          done(err);
        });
      });

    });

    it ('should not find user if they have logged out', function (done) {

      var agent = request.agent(sails.hooks.http.app);

      agent
        .get('/logout')
        .expect(302, function(err, res) {

          if (err)
            return done(err);

          agent
            .get('/user/'+userId)
            .expect(403)
            .end(function(err) {
              done(err);
            });
      });

    });

  });

});
