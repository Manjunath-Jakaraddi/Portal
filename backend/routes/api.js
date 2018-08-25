var express     =   require('express')
var bodyParser  =   require('body-parser');
var mongoose    =   require('mongoose');
var User        =   require('../models/user');
var nodemailer  =   require('nodemailer');
var sgTransport =   require('nodemailer-sendgrid-transport');
var config      =   require('../../config');
var jwt         =   require('jsonwebtoken');
var Item           =   require('../models/Items.js');
const async     =   require('async');

var options = {
        service: 'Gmail',
        auth: {
            user: config.mailingcredentials.email,
            pass: config.mailingcredentials.password
        }
};

var client = nodemailer.createTransport(options);



apiRoute = express.Router();
apiRoute.use(bodyParser.json());


apiRoute.route('/users')
.post(function (req, res, next) {
  console.log("asdfa");
  if(req.body) {
      var user = new User();
      user.username = req.body.username;
      user.name = req.body.firstName+' '+req.body.lastName;
      user.email = req.body.email;
      user.registered = true;
      user.active = false;
      user.password = req.body.password;
      user.location=req.body.location;
      user.pincode=req.body.pincode;
      user.city=req.body.city;
      user.save(function (err,user) {
      if(err) {
        res.json({success: false,message: err});
      } else {
        var email = {
              from: 'manjunath180397@gmail.com',
              to: user.email,
              subject: 'Your Activation Link',
              text: 'Hello ' + user.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://'+ config.URL + '/activate/' + user.temporarytoken,
              html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at '+ config.URL + '. Please click on the link below to complete your activation:<br><br><a href="http://'+ config.URL + '/activate/'+user.temporarytoken+'">http://'+ config.URL + '</a>'
        };
        client.sendMail(email, function(error, info){
              if(error){
                  console.log(error);
              }else{
                  console.log('Message sent: ' + info.response);
                  console.log(user.email);
              };
        });
        res.json({ success: true, message: 'Account registered! Please check your e-mail for activation link.' });
      }
    });
  } else {
      res.json({success: false,message: 'No User data sent!!'});
  }
});


apiRoute.route('/checkusername')
.post(function (req, res, next) {
    User.findOne({ username: req.body.username }).select('username registered').exec(function (err,user) {
      if (err) {
            res.json({ success: false, message: err});
        } else {
            if(user) {
              if (user.registered === true) {
                res.json({ success: false, message: 'USN already registered!'});
              } else {
                res.json({ success: true, message: 'Valid USN'});
              }
            } else {
              res.json({ success: false, message: 'Invalid USN!'});
            }
        }
    });
});


apiRoute.route('/checkEmail')
.post(function (req, res, next) {
    User.findOne({ email: req.body.email }).select('email').exec(function (err,user) {
      if (err) {
          res.json({ success: false, message: err});
        } else {
            if(user) {
              res.json({ success: false, message: 'Email is already registered!'});
            } else {
              res.json({ success: true, message: 'Valid Email'});
            }
        }
    });
});


apiRoute.route('/authenticate')
.post(function (req, res, next) {
    var loginUser = req.body.username;
    User.findOne({ username: loginUser }).select('email username password active registered').exec(function (err, user) {
        if(err) {
          res.json({ success: false, message: err});
        } else {
            if(!user) {
                res.json({ success: false, message: 'Username does not exists!'});
            } else if(user) {
                if (user.registered === false) {
                  res.json({ success: false, message: 'User not yet registered!'});
                } else if(!req.body.password) {
                    res.json({ success: false, message: 'Password not provided!'});
                } else {
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.json({success: false, message: 'Could not authenticate user'});
                    } else if (!user.active) {
                        res.json({ success: false, message: 'Accout not yet activated.Please check your email for the activation Link.',expired: true});
                    } else {
                      var token = jwt.sign({ username: user.username, email: user.email}, config.secretKey, {expiresIn: '24h'});
                      res.json({ success: true, message: 'User Authenticated',token: token});
                    }
                }
            }
        }
    });
});

apiRoute.route('/activate/:token')
.put(function (req, res, next) {
    User.findOne({ temporarytoken: req.params.token}, function (err, user) {
        if(err) {
          res.json({success: false, message: err});
        } else {
            var token = req.params.token;
            jwt.verify(token, config.secretKey, function (err, decoded) {
                if(err) {
                    res.json({success: false, message: 'Activation Link has expired requset for a new one'});
                } else if(!user) {
                    res.json({success: false, message: 'Activation Link has expired request for a new one'});
                } else {
                    user.temporarytoken = false;
                    user.active = true;
                    user.save(function (err) {
                        if(err) {
                          console.log(err);
                        } else {
                          var email = {
                                from: 'manjunath180397@gmail.com',
                                to: user.email,
                                subject: 'Account Activated',
                                text: 'Hello ' + user.name + ', Your account has been successfully activated!.<br>You can Login now.',
                                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!.<br>You can Login now.'
                          };
                          client.sendMail(email, function(error, info){
                                if(error){
                                    console.log(error);
                                }else{
                                    console.log('Message sent: ' + info.response);
                                    console.log(user.email);
                                };
                          });
                          res.json({success: true, message: 'Accout Activated!'});
                        }
                    });
                }
            });
        }
    });
});

apiRoute.route('/resend')
.post(function (req, res, next) {
    User.findOne({ username: req.body.username }).select('username password active').exec(function (err, user) {
        if(err){
            res.json({success: false, message: err});
        } else {
            if(!user) {
                res.json({success: false, message: 'Could not authenticate user'});
            } else if(user) {
                if(req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                    if(!validPassword) {
                        res.json({ success: false, message: 'Could not authenticate the user'});
                    } else if(user.active){
                        res.json({ success: false, message: 'Account is already active. Please try to login'});
                    } else {
                        res.json({ success: true, user: user});
                    }
                } else {
                    res.json({ success: false, message: 'Password not provided!'});
                }
            }
        }
    })
})

.put(function (req, res, next) {
    User.findOne({ username: req.body.username }).select('username name email temporarytoken').exec(function (err, user) {
        if(err) {
            res.json({ success: false, message: err});
        } else {
            user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, config.secretKey, { expiresIn: '24h'});
            user.save(function (err) {
              if(err) {
                  console.log(err);
              } else {
                  var email = {
                        from: 'manjunath180397@gmail.com',
                        to: user.email,
                        subject: 'Activation Link Request',
                        text: 'Hello ' + user.name + ', You recently requested a new account activation link. Please click on the following link to complete your activation: https://'+ config.URL + '/activate/' + user.temporarytoken,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested a new account activation link. Please click on the link below to complete your activation:<br><br><a href="http://'+ config.URL + '/activate/' + user.temporarytoken + '">http://'+ config.URL + '/activate/</a>'
                  };
                  client.sendMail(email, function(error, info){
                        if(error){
                            console.log(error);
                        }else{
                            console.log('Message sent: ' + info.response);
                            console.log(user.email);
                        };
                  });
                  res.json({ success: true, message: 'Activation link has been sent to '+ user.email + '!'});
              }
            });
        }
    });
});

apiRoute.route('/resetusername/:email')
.get(function (req, res, next) {
  User.findOne({ email: req.params.email }).select('email name username').exec(function (err, user) {
      if(err) {
        res.json({ success: false, message: err });
      } else {
        if(!user) {
            res.json({ success: false, message: 'E-mail not found!!' });
        } else {
            var email = {
                  from: 'manjunath180397@gmail.com',
                  to: user.email,
                  subject: 'Request for Username',
                  text: 'Hello ' + user.name + ', You recently requested your username. Please save it for future reference ' + user.username,
                  html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested your username. Please save it for future reference ' + user.username
              };
            client.sendMail(email, function(error, info){
                  if(error){
                      console.log(error);
                  }else{
                      console.log('Message sent: ' + info.response);
                      console.log(user.email);
                  };
            });
            res.json({ success: true, message: 'Username has been sent to e-mail!'});
        }
      }
  });
});

apiRoute.route('/resetpassword')
.put(function (req, res, next) {
  User.findOne({ username: req.body.username}).select('name username email active resettoken registered').exec(function (err, user) {
      if(err) {
        res.json({ success: false, message: err});
      } else {
        if(!user) {
            res.json({ success: false, message: 'Username was not found!'});
        } else if(!user.active) {
            res.json({ success: false, message: 'Account not yet activated'});
        } else if (user.registered === false) {
            res.json({ success: false, message: 'Account not yet registered!'});
        } else {
            user.resettoken = jwt.sign({ username: user.username, email: user.email }, config.secretKey, {expiresIn: '24h'});
            user.save(function (err) {
              if (err) {
                  res.json({ success: false, message: err});
              } else {
                console.log(user.resettoken);
                  var email = {
                        from: 'manjunath180397@gmail.com',
                        to: user.email,
                        subject: 'Request for Reset password',
                        text: 'Hello ' + user.name + ', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://'+ config.URL + '/reset/' + user.resettoken,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://'+ config.URL + '/reset/' + user.resettoken + '">http://'+ config.URL + '/reset/</a>'
                  };
                  client.sendMail(email, function(error, info){
                        if(error){
                            console.log(error);
                        }else{
                            console.log('Message sent: ' + info.response);
                            console.log(user.email);
                        };
                  });
                  res.json({ success: true, message: 'Please check your e-mail for password reset link'});
              }
            });
        }
      }
  });
});
apiRoute.route('/resetpassword/:token')
.get(function (req, res, next) {
  User.findOne({ resettoken: req.params.token}).select().exec(function (err, user) {
    if(err) {
      res.json({ success: false, message: err});
    } else {
      var token = req.params.token;
      jwt.verify(token, config.secretKey, function (err, decoded) {
        if (err) {
          res.json({ success: false, message: 'Password link has expired!'});
        } else {
          if (!user) {
            res.json({ success: false, message: 'Password link has expired!'});
          } else {
            res.json({ success: true, user: user})
          }
        }
      });
    }
  });
});

apiRoute.route('/savepassword')
.put(function (req, res, next) {
    User.findOne({ username: req.body.username }).select('username email name password resettoken').exec(function (err, user) {
      if (err) {
        res.json({ success: false, message: err});
      } else {
        if (req.body.password === null || req.body.password === '') {
          res.json({ success: false, message: 'Password not provided!'});
        } else {
          user.password = req.body.password;
          user.resettoken = false;
          user.save(function (err) {
            if (err) {
                res.json({ success: false, message: err});
            } else {
                var email = {
                      from: 'manjunath180397@gmail.com',
                      to: user.email,
                      subject: 'Password reset Successful',
                      text: 'Hello ' + user.name + ', This e-mail is to notify you that your password was recently reset at '+ config.URL,
                      html: 'Hello<strong> ' + user.name + '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at '+ config.URL
                };
                client.sendMail(email, function(error, info){
                      if(error){
                          console.log(error);
                      }else{
                          console.log('Message sent: ' + info.response);
                          console.log(user.email);
                      };
                });
                res.json({ success: true, message: 'Password has been reset!' });
            }
          })
        }
      }
    });
});

// Routes after this need user authentication
var verifyuser = function (req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, config.secretKey, function (err, decoded) {
          if (err) {
            res.json({ success: false, message: 'Token Invalid'});
          } else {
              req.decoded = decoded;
              next();
          }
      });
    } else {
        res.json({ success: false, message: 'No token provided!'});
    }
};

var verifystudent = function (req, res, next) {
  if (req.decoded.username) {
    User.findOne({ username: req.decoded.username}, function (err, user) {
      if (err) {
        res.json({ success: false, message: err});
      } else if (user){
        if ( user.permission !== 'user') {
          res.json({ success: false, message: 'Insuffcient Permissions!'});
        } else {
          next();
        }
      } else {
        res.json({ success: false, message: 'User not found!'});
      }
    });
  } else {
    res.json({ success: false, message: 'User not found!'});
  }
};
var verifyteacher = function (req, res, next) {
  if (req.decoded.username) {
    User.findOne({ username: req.decoded.username}, function (err, user) {
      if (err) {
        res.json({ success: false, message: err});
      } else if (user) {
        if ( user.permission !== 'retailer') {
          res.json({ success: false, message: 'Insuffcient Permissions!'});
        } else {
          next();
        }
      } else {
        res.json({ success: false, message: 'User not found!'});
      }
    });
  } else {
    res.json({ success: false, message: 'User not found!'});
  }
};
var verifyadmin = function (req, res, next) {
  if (req.decoded.username) {
    User.findOne({ username: req.decoded.username}, function (err, user) {
      if (err) {
        res.json({ success: false, message: err});
      } else if (user) {
        if ( user.permission !== 'admin') {
          res.json({ success: false, message: 'Insuffcient Permissions!'});
        } else {
          next();
        }
      } else {
        res.json({ success: false, message: 'User not found!'});
      }
    });
  } else {
    res.json({ success: false, message: 'User not found!'});
  }
};

apiRoute.route('/me')
.all(verifyuser)
.post(function (req, res, next) {
  User.findOne({ username: req.decoded.username}).select('name').exec(function (err,user) {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      req.decoded.name = user.name;
      res.send(req.decoded);
    }
  })
});

apiRoute.route('/renewToken/:username')
.all(verifyuser)
.get(function (req, res, next) {
    User.findOne({ username: req.params.username }).select('username email').exec(function (err, user) {
      if(err) {
        res.json({ success: false, message: err});
      } else {
        if (!user) {
            res.json({ success: false, message: 'No user was found!!'});
        } else {
          var newToken = jwt.sign({ username: user.username, email: user.email }, config.secretKey, { expiresIn: '24h'});
          res.json({ success: true, token: newToken});
        }
      }
    });
});

apiRoute.route('/permission')
.all(verifyuser)
.get(function (req, res, next) {
  User.findOne({ username: req.decoded.username} , function (err,user) {
    if (err) {
      res.json({ success: false, message: 'No user was found!'});
    } else {
      res.json({ success: true, permission: user.permission });
    }
  });
});


apiRoute.route('/management')
.all(verifyuser,verifyadmin)
.get(function (req, res, next) {
  User.find({ }, function (err,users) {
    if (err) {
      res.json({ success: false, message: err});
    } else {
      res.json({ success: true, users: users, permission: 'admin' });
    }
  });
});
apiRoute.route('/itemscreate')
.all(verifyuser,verifyadmin)
.post(function(req,res,next) {
  var item=new Item();
  item.itemname=req.body.itemname;
  item.ingrediants=req.body.ingrediants;
  item.description=req.body.description;
  item.imageurl=req.body.imageurl;
  item.cost=req.body.cost;
  item.offer=req.body.offer;
  console.log(req.body.offer);
  item.save(function (err,item) {
    if(!err) {
      res.json({success: false,message: err});
    } else {
    res.json({success: true, message: "Item added Successfully!"});
  }
});
});
apiRoute.route('/getitems')
.all(verifyuser)
.get(function (req,res,next) {
  Item.find().exec(function (err,items) {
    if(err) {
      console.log(err);
      res.json({success: false, message: err});
    } else {
      res.json({success: true, message: items});
    }
  })
});
apiRoute.route('/getselected')
.all(verifyuser,verifystudent)
.post(function (req,res,next) {
  User.find({"products.prodname":req.body.prodname}).exec(function (err,users) {
    if(err) {
      res.json({success:false, message: err});
    } else {
      res.json({success:true,message: users});
    }
  });
})
apiRoute.route('/changePermission')
.all(verifyuser,verifyadmin)
.put(function (req, res) {
  User.findOne({ username: req.body.username }).select('permission').exec(function (err, user) {
    if (err) {
      res.json({ success: false, message: err });
    } else if (user) {
      user.permission = req.body.permission;
      user.save(function (err) {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          res.json({ success: true });
        }
      });
    } else {
      res.json({ success: false, message: 'User not found!'});
    }
  });
});

apiRoute.route('/createusers')
.all(verifyuser,verifyadmin)
.post(function (req, res) {
  async.each(req.body,function (detail,callback) {
    if (detail.username) {
      var user = new User();
      user.username = detail.username;
      user.name = 'Dummy User';
      user.email = detail.email;
      user.registered = false;
      user.active = false;
      user.password = 'Manju@123';
      for (var j = 0; j < 8; j++) {
        (function (k) {
          var sem = {};
          sem.studentid = user._id;
          sem.Sgpa = null;
          sem.SemNumber = k+1;
          user.semesters.push(sem);
        })(j);
      }
      user.save(function (err,user) {
        if (err) {
            callback(err);
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  },function (err) {
    if (err) {
      console.log(err);
      res.json({ success: false, message: err });
    } else {
      res.json({ success: true, message: 'Users created Successfully!' });
    }
  });
});

module.exports = apiRoute;
