const request = require('request');

var getRows = (formData, callback) => {
    console.log('formData', formData);
    console.log(`https://www.quandl.com/api/v3/datasets/WIKI/${formData.userInputs.ticker}.json?column_index=4&start_date=${formData.userInputs.startDate}&end_date=${formData.userInputs.endDate}&collapse=monthly&transform=rdiff&api_key=Vk29NQzysMurK6sfhDxw`)
    request({
        url: `https://www.quandl.com/api/v3/datasets/WIKI/${formData.userInputs.ticker}.json?column_index=4&start_date=${formData.userInputs.startDate}&end_date=${formData.userInputs.endDate}&collapse=daily&transform=rdiff&api_key=Vk29NQzysMurK6sfhDxw`,
        json: true 
    }, (error, response, body) => {
        if(error) {
            callback('Unable to connect to servers');
        } else if(response.statusCode === 400) {
             callback('Unable to fetch data');
        } else if(response.statusCode === 200) {
            console.log(200);
            callback(undefined, body);
        }
     });
}

module.exports.getRows = getRows;