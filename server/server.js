var express =  require('express');
const path = require('path');
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
    QuandlApi.getRows(req.body.formData, (errorMessage, response) => {
      console.log(response);
    })
});


app.listen(port);
console.log('listening on ' + port);