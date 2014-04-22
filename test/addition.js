'use strict';

// import the moongoose helper utilities
var utils = require('./utils');
var request = require('supertest');
var should = require('should');
var app = require('../server').router;

describe('addition', function () {
 //... previous test
 it('should return 2 given the url /add/1/1', function (done) {
   request(app)
     .get('/add/1/1')
     .expect(200)
     .end(function (err, res) {
       should.not.exist(err);
       parseFloat(res.text).should.equal(2);
       done();
     });
 });
});