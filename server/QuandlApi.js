const request = require('request');
const keys = require('../keys');

var getRows = (formData, callback) => {
    console.log('formData', formData);
    request({
        url: `https://www.quandl.com/api/v3/datasets/WIKI/${formData.userInputs.ticker}.json?start_date=${formData.userInputs.startDate}&end_date=${formData.userInputs.endDate}&collapse=daily&key=${keys.quandlApiKey}`,
        json: true 
    }, (error, response, body) => {
        if(error) {
            console.log('Unable to connect to servers')
            callback('Unable to connect to servers', undefined);
        } else if(response.statusCode === 400) {
             console.log('Unable to fetch data', undefined)
             callback('Unable to fetch data', undefined);
        } else if(response.statusCode === 503) {
             console.log('Service Unavailable', undefined)
             callback('Unable to fetch data', undefined);
        } else if(response.statusCode === 200) {
            console.log(200);
            callback(undefined, body);
        }
     });
}

module.exports.getRows = getRows;