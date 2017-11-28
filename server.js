var express     = require('express');
var app         = express();
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var path        = require('path');
var config      = require('./config');
var port        = process.env.PORT || 8080;



// 
// var ConversationV1 = require('watson-developer-cloud/conversation/v1');
// var conversation = new ConversationV1({
//   username: '613d7a7a-90d3-47d3-a945-c3f3f35e595e', // replace with username from service key
//   password: '3DLtt87nQqvH', // replace with password from service key
//   path: { workspace_id: '5e1348a0-3326-4420-be8f-71b89c7fc44d' }, // replace with workspace ID
//   version_date: '2017-05-26'
// });







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


//
//
//
//
// app.post('/test',function (req,res,next) {
//   console.log(req.body);
//   conversation.message({
//     input: { text: req.body.message }
//     }, function (err, response)  {
//       if (err) {
//         console.error(err);
//         res.json({"message":err})
//       }
//       if (response.output.text.length != 0) {
//           res.json({"message":response.output.text[0]});
//       }
//     })
// })

app.get('*',function (req,res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});
app.listen(port,function () {
  console.log("Server listening on port " + port);
})
