var express = require("express");
const path = require("path");
const keys = require('../keys');
const moment = require("moment"); moment().format();
const mongodb = require("mongodb");
const dbUrl = process.env.MONGODB_URI || `mongodb://localhost:27017/${keys.dbName}`;
const port = process.env.PORT || 8080;
const QuandlApi = require("./QuandlApi");
var app = express();
var bodyParser = require("body-parser");
var db;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../build")))

.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});


mongodb.MongoClient.connect(dbUrl, (err, client) => {

  //if the user click on save button, data will be save on this object.
  const lastSearchData = {};

  //end point called on page load
  app.post("/api/get-ticker-data", (req, res, next) => {
    console.log("FORM DATA1:", req.body.formData);
    req.body.formData.userInputs.endDate = moment(
      req.body.formData.userInputs.date
    ).format("YYYY/MM/DD");
    req.body.formData.userInputs.startDate = moment(
      req.body.formData.userInputs.date
    ).subtract(1, "month").format("YYYY/MM/DD");
    console.log("FORM DATA2:", req.body.formData);
    QuandlApi.getRows(req.body.formData, (errorMessage, response) => {
      console.log("response", response);

      //saving the data on this object for case user clicks save button
      lastSearchData.data = response;
      res.json({ data: response });
    });
  });


  //end point called when user clicks the save button
  app.post("/api/save-ticker-data", (req, res, next) => {
    console.log("REQ.BODY", req.body);

    //Saving the data from the api that is on lastSearchData object to db - stockDataDb
    saveDataToDb(lastSearchData);

    //Saving User search on db - savedSearchesDb
    db = client.db("savedSearchesDb");
    if (err) throw err;
    console.log("Connection Established");
    db
      .listCollections({ name: "savedSearchesDb" })
      .next((err, collinfo) => {
        if (!collinfo) {
          db.createCollection("savedSearchesDb");
          console.log("created collection", db.collection("savedSearchesDb"));
        } else {
          console.log("Existing Collection", collinfo);
           var collection = db.collection("savedSearchesDb");
           var APIstockBasicInfo = {
              dataset_code: req.body.dataset_code,
              database_code: req.body.database_code,
              name: req.body.name,
              description: req.body.description,
              start_date: req.body.start_date
            };

             collection.insert(APIstockBasicInfo, (err, data) => {
             collection.find({}).toArray((err, data) => {
                if (err) throw err;
                console.log("data", data);
                res.json(data);
              });
            });
        }
      });
  });



  const saveDataToDb = () => {
    console.log("Last search data from api: ", lastSearchData);
    db = client.db("stockDataDb");
    if (err) throw err;
    console.log("Connection Established");
    db.listCollections({ name: "stockDataDb" }).next((err, collinfo) => {
      if (collinfo) {
        // The collection exists
        console.log("collinfo");
        console.log(collinfo);
      } else {
        db.createCollection("stockDataDb");
        console.log(db.collection("stockDataDb"));
      }
    });

    var collection = db.collection("stockDataDb");
    collection.insert(lastSearchData.data.dataset, (err, data) => {
      if (err) throw err;
      console.log("data");
      console.log("RESPONSE", data);
    });
  }

  

  //called when user clicks the delete button - deleting the item from the search history db
  app.delete(`/api/delete-ticker-data/:id`, (req, res, next) => {
    console.log("req.params.id", req.params.id);
    db = client.db("savedSearchesDb");
    var collection = db.collection("savedSearchesDb");
    var obj_id = new require("mongodb").ObjectID(req.params.id);
    collection.remove({ _id: obj_id }, { justOne: true }, () => {
      collection.find({}).toArray((err, data) => {
        if (err) throw err;
        console.log("data");
        console.log(data);
        res.json(data);
      });
    });
  });

  //Calld when user clicks one of the searched history item
  app.post("/api/get-history-data", (req, res, next) => {
    console.log("/api/get-search-history-data");
    db = client.db("savedSearchesDb");
    var collection = db.collection("savedSearchesDb");
    collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray((err, data) => {
        if (err) throw err;
        console.log("data", data);
        res.json(data);
      });
  });

  app.post("/api/get-searched-item-data", (req, res, next) => {
    console.log("REQ.BODY", req.body);
    db = client.db("stockDataDb");
    var collection = db.collection("stockDataDb");
    collection
      .find({ start_date: req.body.date, dataset_code: req.body.name })
      .toArray((err, data) => {
        if (err) throw err;
        console.log("data", data);
        res.json(data);
      });
  });
});


app.listen(port);
console.log("listening on " + port);
