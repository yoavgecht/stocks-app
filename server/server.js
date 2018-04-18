var express = require("express");
const path = require("path");
const keys = require('../keys');
const moment = require("moment"); moment().format();
const mongodb = require("mongodb");
const dbUrl = process.env.MONGODB_URI || `mongodb://localhost:27017/${keys.localDbName}`;
var db;
const port = process.env.PORT || 8080;
const QuandlApi = require("./QuandlApi");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../build")))

app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});


mongodb.MongoClient.connect(dbUrl, (err, database) => {
  db = database.db(database.dbName);
  if (err) throw err;

  console.log('Connection Established');

   //Called on page load to retrieve the user search history
  app.post("/api/get-saved-searches-list", (req, res, next) => {
    console.log("/api/get-saved-searches-list");
    console.log("/api/get-search-history-data");
    db.listCollections({ name: "stockDataDb" })
      .next((err, collinfo) => {
        if (!collinfo) {
          db.createCollection("stockDataDb");
          console.log("created collection", db.collection("stockDataDb"));
        } else {
          var collection = db.collection("stockDataDb");
          collection.find({}).toArray((err, data) => {
          if (err) throw err;
          console.log("data", data);
          res.json(data);
         });
       }
    });
   });

  //called on Get Ticker data button clicked
  app.post("/api/get-ticker-data", (req, res, next) => {
    console.log("/api/get-ticker-data req.body:", req.body.formData);
    req.body.formData.userInputs.startDate = moment(req.body.formData.userInputs.startDate).format("YYYY/MM/DD");
    req.body.formData.userInputs.endDate = moment(req.body.formData.userInputs.endDate).format("YYYY/MM/DD");
    QuandlApi.getRows(req.body.formData, (errorMessage, response) => {
      if(errorMessage){
        console.log(errorMessage)
        res.json({ status: errorMessage });
      } 
      response.dataset.data = response.dataset.data.reverse();
      console.log("response", response);
      res.json({ data: response });
    });
  });


  //called when user clicks the save button
  app.post("/api/save-ticker-data", (req, res, next) => {
    console.log("#############################################");
    console.log("/api/save-ticker-data REQ.BODY", req.body);
    db.listCollections({ name: "stockDataDb" }).next((err, collinfo) => {
        if (collinfo) {
           var collection = db.collection("stockDataDb");
           collection.find({dataset_code: req.body.dataset_code, end_date: req.body.end_date}).toArray((err, data) => {
              if(!data.length){
                  collection.insert(req.body, (err, data) => {
                    if (err) throw err;
                      collection.find({}).toArray((err, data) => {
                        if (err) throw err;
                        res.json(data);
                      });
                  });
                } else{ 
                     console.log("status data already saved");
                     collection.find({}).toArray((err, data) => {
                        if (err) throw err;
                        data.status = "Search already saved";
                        res.json(data);
                      });
                }
            });
        } else {
          db.createCollection("stockDataDb");
          console.log(db.collection("stockDataDb"));
        }
      }); 
  }); 


  //called when user clicks the delete button - deleting the item from the search history db
  app.delete(`/api/delete-list-saved-searches-item/:id`, (req, res, next) => {
    console.log("req.params.id", req.params.id);
    var collection = db.collection("stockDataDb");
    var obj_id = new require("mongodb").ObjectID(req.params.id);
    collection.remove({ _id: obj_id }, { justOne: true }, () => {
      collection.find({}).toArray((err, data) => {
        if (err) throw err;
        console.log(`/api/delete-ticker-data/:id`, data);
        res.json(data);
      });
    });
  });

 
  //called when user clicks on one of the searched history list item
  app.post("/api/get-searched-item-data", (req, res, next) => {
    console.log("REQ.BODY", req.body);
    var collection = db.collection("stockDataDb");
    collection.find({ start_date: req.body.date, dataset_code: req.body.name }).toArray((err, data) => {
        if (err) throw err;
        console.log("data", data);
        res.json(data);
      });
  });
});



app.listen(port);
console.log("listening on " + port);
