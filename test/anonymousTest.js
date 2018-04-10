'use strict';
var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
const anonymous = require('../api/anonymous.js')

chai.use(chaiHttp);

const userCredentials = {
    email: 'johnny@ufl.edu',
    password: 'Family49'
}

describe('anonymous.js', function() {
    var host = "http://localhost:8080/anonymous.js";
    var path = "/user/login";

    it('should send parameters to : /path POST', function(done) {
        chai
            .request(host)
            .post(path, function(userCredentials, res, next) {
                console.log('RESPONSE');
                console.log(res);
            })
            .end(function(error, response, body) {
                expect(response).to.have.status(200);
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