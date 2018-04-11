var express =  require('express');
const path = require('path');
const moment = require('moment');
moment().format();
const mongodb = require('mongodb');
const dbUrl = 'mongodb://localhost:27017/stockdata';
const QuandlApi = require('./QuandlApi');
var app = express();
const port = process.env.PORT || 8080;
var bodyParser  =  require('body-parser');
var db;
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


    mongodb.MongoClient.connect(dbUrl, (err, client) => {
        app.post('/api/save-ticker-data', (req, res, next) => {
            console.log(req.body);
            db = client.db('stockdata');
            if (err) throw err;
		    console.log('Connection Established');
            db.listCollections({name: 'stockdata'})
                .next(function(err, collinfo) {
                    if (collinfo) {
                        // The collection exists
                        console.log('collinfo');
                        console.log(collinfo);
                    } else{
                        db.createCollection("stockdata");
                        console.log(db.collection('stockdata'));
                    }
   		        });
                    var collection = db.collection('stockdata');
                    var stockData = {
                        dataset_code: req.body.dataset_code,
                        database_code: req.body.database_code,
                        name: req.body.name,
                        description: req.body.description 
                    }

                    collection.insert(stockData, function(err, data){
                        res.json(data);
                    });
            });

        app.delete('/api/delete-ticker-data', (req, res, next) => {
            console.log(req.body);
            db = client.db('stockdata');
            var collection = db.collection('stockdata');
            collection.findOne({ dataset_code: req.body.dataset_code }, function(err, data){
							console.log(data._id);
                collection.remove({_id: data._id},{justOne: true}, function(){
			 					res.json(null);
			 			});
            });
            


        });
    })






app.listen(port);
console.log('listening on ' + port);