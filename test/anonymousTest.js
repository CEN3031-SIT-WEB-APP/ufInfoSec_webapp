'use strict';
var expect = require('chai').expect;
var app = require('../app');
var request = require('supertest');

const userCredentials = {
    email: 'johnny@ufl.edu',
    password: 'Family49'
}

var authenticatedUser = request.agent(app);

before(function(done){
  authenticatedUser
    .post('/user/login')
    .send(userCredentials)
    .end(function(err, response){
      expect(response.statusCode).to.equal(200);
      expect('Location', '/home');
      done();
    });
});