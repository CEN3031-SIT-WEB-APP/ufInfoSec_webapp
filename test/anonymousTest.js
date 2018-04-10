'use strict';
var expect = require('chai').expect;
var bodyParser = require('body-parser')
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app.js'); //this could also be exporting the wrong server, since you forced a listen at the end but there could be one earlier on
const anonymous = require('../api/anonymous.js') //you really want to be using this since this exports routes, which is used to make the post request

anonymous.use(bodyParser.json())
anonymous.use(bodyParser.urlencoded({ extended: false }))
chai.use(chaiHttp);

const userCredentials = {
    'email': 'joe@ufl.edu',
    'password': 'hi'
}

describe('anonymous.js', function() {
    var host = "http://localhost:8080";
    var path = "/user/login";

    it('should send parameters to : /path POST', function(done) {
        chai
            .request(anonymous)
            .post(path, function(userCredentials, res, next) {
                console.log("HERE");
            })
            .end(function(error, response) {
                console.log(response);
                expect(response).to.have.status(200);
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });

});