var express     = require('express');
var app         = express();
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var path        = require('path');
var config      = require('./config');
var port        = process.env.PORT || 8080;

// Routes
var apiRoute = require('./backend/routes/api');
var studentapiRoute = require('./backend/routes/studentapi');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Routes Linking
app.use('/api',apiRoute);
app.use('/student/api',studentapiRoute);

// CONNECTING TO MONGODB
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl,function (err) {
  if(err) {
    console.log('Not Successfully connected to database ' + err);
  } else {
    console.log('Successfully connected to database');
  }
})


app.get('*',function (req,res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});
app.listen(port,function () {
  console.log("Server listening on port " + port);
})
