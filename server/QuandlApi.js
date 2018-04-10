const request = require('request');

var getRows = (formData, callback) => {
    request({
        url: `https://www.quandl.com/api/v3/datasets/WIKI/FB.json?column_index=4&start_date=${formData.tickerDate}&end_date=${formData.tickerDate}&collapse=monthly&transform=rdiff&api_key=Vk29NQzysMurK6sfhDxw`,
        json: true 
    }, (error, response, body) => {
        if(error) {
            callback('Unable to connect to Google servers');
        } else if(response.statusCode === 400) {
             callback('Unable to fetch Experienses');
        } else if(response.statusCode === 200) {
            callback(undefined, body);
        }
     });
}

module.exports.searchDestinations = searchDestinations;