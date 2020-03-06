module.exports = {
  'mongoUrl'            :   'mongodb://127.0.0.1:27017/tata_samphan',
  'secretKey'           :   '12345-67890-09876-54321',
  'mailingcredentials'  :   { 'email': 'jakaraddimahesh@gmail.com', 'password': 'asdjfasd'},
  'URL'                 :   'localhost:8000'
  // evening-escarpment-52396.herokuapp.com
  // 'mongodb://localhost:27017/manju'
  // 'mongodb://manju:manju@ds151062.mlab.com:51062/manjurvce'
  // 'localhost:8080'
}

//                          Mailing Templates


//          1 :  SendGrid Account

// a ] Settings

// var options = {
//     auth: {
//         api_user: 'maheshrvce',
//         api_key: 'Mahesh@123'
//     }
// };
// var client = nodemailer.createTransport(sgTransport(options));

// b ] In Api Routes
// var email = {
//         from: 'jakaraddimahesh@gmail.com',
//         to: [user.email],
//         subject: 'Your Activation Link',
//         text: 'Hello ' + user.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:8080/activate/' + user.temporarytoken,
//         html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8080/activate/'+user.temporarytoken+'">http://localhost:8080/activate/</a>'
//     };
//     client.sendMail(email, function(err, info) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(info.message);
//             console.log(user.email);
//         }
// });


//          2 :  Gmail Account

// a ] Settings
// var options = {
//         service: 'Gmail',
//         auth: {
//             user: config.mailingcredentials.email,
//             pass: config.mailingcredentials.password
//         }
// };
// var client = nodemailer.createTransport(options);

//  b ] In Api Routes
// var email = {
//         from: 'jakaraddimahesh@gmail.com',
//         to: [user.email],
//         subject: 'Your Activation Link',
//         text: 'Hello ' + user.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:8080/activate/' + user.temporarytoken,
//         html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8080/activate/'+user.temporarytoken+'">http://localhost:8080/activate/</a>'
//     };
//    client.sendMail(email, function(error, info){
//         if(error){
//             console.log(error);
//         }else{
//             console.log('Message sent: ' + info.response);
//             console.log(user.email);
//         };
//    });
