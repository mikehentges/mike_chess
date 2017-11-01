'use strict';
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var MikeChessDataHelper = require('../mike_chess_data_helper');
chai.config.includeStack = true;

describe('MikeChessDataHelper', function() {
    var subject = new MikeChessDataHelper();
    var airport_code;
    describe('#getAirportStatus', function() {
        context('with a valid airport code', function(){
           it('returns matching airport code', function(){
                airport_code = 'SFO';
                var value = subject.requestAirportStatus(airport_code).then(function(obj) {
                    return obj.IATA;
                });
                return expect(value).to.eventually.eq(airport_code);
            });
        });
        context('with an invalid airport code', function() {
            it('returns invalid airport code', function() {
                airport_code = 'PUNKYBREWSTER';
                return expect(subject.requestAirportStatus(airport_code)).to.be.rejectedWith(Error);
            });
        });
    });
});
