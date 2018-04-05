'use strict';
var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should;
var request = require('request');
var routes = require ('../api/admin.js');


describe('./admin.js', function (done) {

    describe('get requests', function (done) {

        request(routes)
            .get('/admin/list_users')
            .expect('Content-Type', /json/)
            .expect(data).to.be.an('array').that.contains.something.like('id');
            done();
            
    });

});