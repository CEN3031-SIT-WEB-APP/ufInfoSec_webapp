'use strict';
var expect = require('chai').expect;
var app = require('../app');
const anonymous = require('../api/anonymous.js')
var request = require('supertest');

const userCredentials = {
    email: 'johnny@ufl.edu',
    password: 'Family49'
}

describe('anonymous.js', function(done){
    console.log("respond");
    anonymous
        .post('/user/login', userCredentials, { responseType: 'text' })
        .end(function(err, response){
            expect(response.statusCode).to.equal(200);
            expect('Location', '/home');
            console.log('hello');
            done();
        });
});