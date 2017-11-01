'use strict';
var _ = require('lodash');
var rp = require('request-promise');

var ENDPOINT = 'http://services.faa.gov/airport/status/';

function MikeChessDataHelper() {}

MikeChessDataHelper.prototype.requestAirportStatus = function(airportCode){
    return this.getAirportStatus(airportCode).then(
        function(response) {
            console.log('success - received airport info for ' + airportCode);
            return response.body;
        }
    );
};

MikeChessDataHelper.prototype.getAirportStatus = function(airportCode) {
    var options = {
        method: 'GET',
        uri: ENDPOINT + airportCode,
        resolveWithFullResponse: true,
        json: true
    };
    return rp(options);
};

module.exports = MikeChessDataHelper;
