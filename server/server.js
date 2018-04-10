var express =  require('express');
const path = require('path');
const moment = require('moment');
moment().format();
const mongoose = require('mongoose');
const DataModel = require('./data-model');

const QuandlApi = require('./QuandlApi');
var app = express();
const port = process.env.PORT || 8080;
var bodyParser  =  require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../build')))


.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

//getting the data from the client and using it in the template
.post('/api/get-ticker-data', (req, res, next) => {
    console.log('FORM DATA1:', req.body.formData);
    req.body.formData.userInputs.endDate = moment(req.body.formData.userInputs.date).format('YYYY/MM/DD');
    req.body.formData.userInputs.startDate = moment(req.body.formData.userInputs.date).subtract(1, 'month').format("YYYY/MM/DD");
    console.log('FORM DATA2:', req.body.formData);
    QuandlApi.getRows(req.body.formData, (errorMessage, response) => {
     console.log('response', response);
      res.json({data: response});
    })
})

// .post('/api/save-ticker-data', (req, res, next) => {
//     DataModel.findOne({googleId: profile.id}).then((currentData) => {
//             if(currentData){
//                 // already have this data
//                 console.log('data already exists: ', currentData);
//                 done(null, currentData);
//             } else {
//                 // if not, create data in our db
//                 new DataModel({
//                     dataset_code: '',
//                     database_code: '',
//                     name: '',
//                     description: ''
//                 }).save().then((newData) => {
//                     console.log('created new data: ', newData);
//                     done(null, newData);
//                 });
//             }
//     });
// });

// .post('/api/delete-ticker-data', (req, res, next) => {
    
    
// });



app.listen(port);
console.log('listening on ' + port);