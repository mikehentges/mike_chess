'use strict';

module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('airportinfo');
var FAADataHelper = require('./mike_chess_data_helper');


app.launch(function(req, res) {
    var prompt = 'For delay information, tell me an Airport code.';
    res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('airportinfo', {
        'slots': {
            'AIRPORTCODE': 'FAACODES'
        },
        'utterances': ['{|flight|airport} {|delay|status} {|info} {|for} {-|AIRPORTCODE}']
    },
    function(req, res) {
    }
);

app.intent('airportinfo', {
        'slots': {
            'AIRPORTCODE': 'FAACODES'
        },
        'utterances': ['{|flight|airport} {|delay|status} {|info} {|for} {-|AIRPORTCODE}']
    },
    function(req, res) {
        //get the slot
        var airportCode = req.slot('AIRPORTCODE');
        var reprompt = 'Tell me an airport code to get delay information.';

        if (_.isEmpty(airportCode)) {
            var prompt = 'I didn\'t hear an airport code. Tell me an airport code.';
            res.say(prompt).reprompt(reprompt).shouldEndSession(false);
            return true;
        } else {
            var faaHelper = new FAADataHelper();
            return faaHelper.requestAirportStatus(airportCode).then(function(airportStatus) {
                console.log(airportStatus);
                res.say(faaHelper.formatAirportStatus(airportStatus)).send();
            }).catch(function(err) {
                console.log(err.statusCode);
                var prompt = 'I didn\'t have data for an airport code of ' + airportCode;
                res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
            });
            //return false;
        }
    }
);

//console.log(app.utterances().replace(/\{\-\|/g, '{'));
// MDH - removed for chat bot use:
// module.exports = app;

// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

// --------------- Events -----------------------

function dispatch(intentRequest, callback) {
    var log_string = 'request received for userId=' + intentRequest.userId + ', intentName=' + intentRequest.currentIntent.name;
    console.log(log_string);
    const sessionAttributes = intentRequest.sessionAttributes;
    const slots = intentRequest.currentIntent.slots;
    var airportCode = slots.AirportCode;
    airportCode = airportCode.toUpperCase();
    var resultText = 'blank response';

    if (_.isEmpty(airportCode)) {
        resultText = 'I didn\'t get an airport code. Tell me an airport code.';
    } else {
        console.log('non-blank airport code');

        var faaHelper = new FAADataHelper();

        console.log('non-blank airport code #2');

       faaHelper.requestAirportStatus(airportCode).then(function(airportStatus2){
           console.log('in airport status');
            resultText = faaHelper.formatAirportStatus(airportStatus2);
            console.log('after format airport status');
            console.log('result is: ' + resultText);
           callback(close(sessionAttributes, 'Fulfilled',
               {'contentType': 'PlainText', 'content': resultText }));
        }).catch(function(err) {
            console.log(err.statusCode);
            resultText = 'I didn\'t have data for an airport code of ' + airportCode;
           callback(close(sessionAttributes, 'Fulfilled',
               {'contentType': 'PlainText', 'content': resultText }));
       });

       console.log('now result is:' + resultText);

        //resultText = 'non-blank airport code #3';

//       faaHelper.requestAirportStatus(airportCode).then(function(airportStatus) {

//           resultText = 'in request for status';
//            console.log(faaHelper.formatAirportStatus(airportStatus));
//            resultText = faaHelper.formatAirportStatus(airportStatus);
//        }).catch(function(err) {
//            resultText = 'error in request for status';
//            console.log(err.statusCode);
//            resultText = 'I didn\'t have data for an airport code of ' + airportCode;
//        });
    }

//    callback(close(sessionAttributes, 'Fulfilled',
//        {'contentType': 'PlainText', 'content': 'Okay, result is:' + resultText }));

}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            (response) => {
            callback(null, response);
    });
    } catch (err) {
        callback(err);
    }
};