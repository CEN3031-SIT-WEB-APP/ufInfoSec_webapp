'use strict';
var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
const anonymous = require('../api/anonymous.js')
var request = require('supertest');

chai.use(chaiHttp);

const userCredentials = {
    email: 'johnny@ufl.edu',
    password: 'Family49'
}

describe('anonymous.js', function() {
    var host = "http://localhost:8080/";
    var path = "/user/login";

    it('should send parameters to : /path POST', function(done) {
        chai
            .request(host)
            .post(path)
            // .field('myparam' , 'test')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(userCredentials)
            .end(function(error, response, body) {
                expect(response).to.have.cookie('session_id');
                if (error) {
                    console.log('nooo');
                    done(error);
                } else {
                    console.log('yayy')
                    done();
                }
            });
    });

});