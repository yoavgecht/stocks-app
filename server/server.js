var express = require("express");
const path = require("path");
const moment = require("moment");
moment().format();
const mongodb = require("mongodb");
const dbUrl = "mongodb://localhost:27017/stockdata";
const QuandlApi = require("./QuandlApi");
var app = express();
const port = process.env.PORT || 8080;
var bodyParser = require("body-parser");
var db;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app
  .use(express.static(path.join(__dirname, "../build")))

  .get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../build/index.html"));
  });

//getting the data from the client and using it in the template
mongodb.MongoClient.connect(dbUrl, (err, client) => {
  const lastSearchData = {};

  app.post("/api/get-ticker-data", (req, res, next) => {
    console.log("FORM DATA1:", req.body.formData);
    req.body.formData.userInputs.endDate = moment(
      req.body.formData.userInputs.date
    ).format("YYYY/MM/DD");
    req.body.formData.userInputs.startDate = moment(
      req.body.formData.userInputs.date
    )
      .subtract(1, "month")
      .format("YYYY/MM/DD");
    console.log("FORM DATA2:", req.body.formData);
    QuandlApi.getRows(req.body.formData, (errorMessage, response) => {
      console.log("response", response);
      lastSearchData.data = response;
      res.json({ data: response });
    });
  });

  app.post("/api/save-ticker-data", (req, res, next) => {
    console.log("REQ.BODY", req.body);
    saveDataToDb(lastSearchData);
    db = client.db("savedSearchesDb");
    if (err) throw err;
    console.log("Connection Established");
    db
      .listCollections({ name: "savedSearchesDb" })
      .next(function(err, collinfo) {
        if (collinfo) {
          // The collection exists
          console.log("collinfo");
          console.log(collinfo);
        } else {
          db.createCollection("savedSearchesDb");
          console.log(db.collection("savedSearchesDb"));
        }
      });
    var collection = db.collection("savedSearchesDb");
    var stockData = {
      dataset_code: req.body.dataset_code,
      database_code: req.body.database_code,
      name: req.body.name,
      description: req.body.description,
      start_date: req.body.start_date
    };

    collection.insert(stockData, function(err, data) {
      collection.find({}).toArray(function(err, data) {
        if (err) throw err;
        console.log("data");
        console.log(data);
        res.json(data);
      });
    });
  });

  function saveDataToDb() {
    console.log("STOCKDATA: ", lastSearchData);
    db = client.db("stockDataDb");
    if (err) throw err;
    console.log("Connection Established");
    db.listCollections({ name: "stockDataDb" }).next(function(err, collinfo) {
      if (collinfo) {
        // The collection exists
        console.log("collinfo");
        console.log(collinfo);
      } else {
        db.createCollection("stockDataDb");
        console.log(db.collection("stockDataDb"));
      }
    });

        app.delete(`/api/delete-ticker-data/:id`, (req, res, next) => {
            console.log('req.params.id', req.params.id);
            db = client.db('savedSearchesDb');
            var collection = db.collection('savedSearchesDb');
            var obj_id = new require('mongodb').ObjectID(req.params.id);
            collection.remove({_id: obj_id} ,{justOne: true}, () => {
                 collection.find({}).toArray(function(err, data){
                    if(err) throw err;
                    console.log('data');
                    console.log(data);
                    res.json(data);
                });
            });
           
        });

        //GET IS NOT WORKING SO USED POST
        app.post('/api/get-history-data', (req, res, next) => {
              console.log('/api/get-search-history-data');
              db = client.db('savedSearchesDb');
              var collection = db.collection('savedSearchesDb');
              collection.find({}).toArray(function(err, data){
                if(err) throw err;
                console.log('data');
                console.log(data);
                res.json(data);
            });
        });

        app.post('/api/get-searched-item-data', (req, res, next) => {
              console.log('REQ.BODY', req.body);
              db = client.db('stockDataDb');
              var collection = db.collection('stockDataDb');
              var obj_id = new require('mongodb').ObjectID(req.body.stockId);
              collection.find({obj_id: obj_id}).toArray(function(err, data){
                if(err) throw err;
                console.log('data');
                console.log(data);
                res.json(data);
            });
        });
        
       


    var collection = db.collection("stockDataDb");
    collection.insert(lastSearchData.data.dataset, function(err, data) {
      if (err) throw err;
      console.log("data");
      console.log("RESPONSE", data);
    });
  }

  app.delete(`/api/delete-ticker-data/:id`, (req, res, next) => {
    console.log("req.params.id", req.params.id);
    db = client.db("savedSearchesDb");
    var collection = db.collection("savedSearchesDb");
    var obj_id = new require("mongodb").ObjectID(req.params.id);
    collection.remove({ _id: obj_id }, { justOne: true }, () => {
      collection.find({}).toArray(function(err, data) {
        if (err) throw err;
        console.log("data");
        console.log(data);
        res.json(data);
      });
    });
  });

  //GET IS NOT WORKING SO USED POST
  app.post("/api/get-history-data", (req, res, next) => {
    console.log("/api/get-search-history-data");
    db = client.db("savedSearchesDb");
    var collection = db.collection("savedSearchesDb");
    collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray(function(err, data) {
        if (err) throw err;
        console.log("data");
        console.log(data);
        res.json(data);
      });
  });

  app.post("/api/get-searched-item-data", (req, res, next) => {
    console.log("REQ.BODY", req.body);
    db = client.db("stockDataDb");
    var collection = db.collection("stockDataDb");
    var obj_id = new require("mongodb").ObjectID(req.body.stockId);
    collection.find({obj_id: obj_id})
      .toArray(function(err, data) {
        if (err) throw err;
        console.log("data");
        console.log(data);
        res.json(data);
      });
  });
});

app.listen(port);
console.log("listening on " + port);
