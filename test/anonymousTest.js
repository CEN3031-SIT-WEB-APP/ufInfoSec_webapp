'use strict';
var expect = require('chai').expect;
var bodyParser = require('body-parser')
var chai = require('chai');
var chaiHttp = require('chai-http');
var express = require('express');
var cookieParser = require('cookie-parser')
var app = express();
app.use(cookieParser("secret"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })) //this could also be exporting the wrong server, since you forced a listen at the end but there could be one earlier on
const anonymous = require('../api/anonymous.js') 
app.use(anonymous)//you really want to be using this since this exports routes, which is used to make the post request

chai.use(chaiHttp);

const userCredentials = {
    "email": 'joe@ufl.edu',
    "password": 'hi'
}

describe('anonymous.js', function() {
    var host = "http://localhost:8080";
    var path = "/user/login";

    it('should send parameters to : /path POST', function(done) {
        chai
            .request(app)
            .post(path)
            .set('content-type', 'application/json')
            .send(userCredentials)
            .end(function(error, response) {
                expect(response).to.have.status(200);
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });

});