'use strict';
var expect = require('chai').expect;
var app = require('../app');
var request = require('supertest');


describe('./admin.js', function (done) {

    describe('get requests', function (done) {

        request('/admin/list_users')
            .get('/admin/list_users')
            .expect('Content-Type', /json/)
            .expect(data).to.be.an('array').that.contains.something.like('id');
            done();
            
    });

});