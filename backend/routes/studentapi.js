var express           =   require('express')
var bodyParser        =   require('body-parser');
var mongoose          =   require('mongoose');
var config            =   require('../../config');
var jwt               =   require('jsonwebtoken');
var SubjectModule     =   require('../models/subject.js');
var User              =   require('../models/user.js');
var teacher           =   require('../models/teacher.js');
const async           =   require('async');
var mysql             =  require('mysql');

// CONNECTING TO MYSQL DATABASE
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'please',
  database : 'manju',
  multipleStatements: true
});


var Subject = SubjectModule.Subject;

var SubjectDetails = teacher.SubjectDetails;

apiRoute = express.Router();
apiRoute.use(bodyParser.json());

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
  User.findOne({ username: req.decoded.username}, function (err, user) {
    if (err) {
      res.json({ success: false, message: err});
    } else if (user){
      if ( user.permission !== 'student') {
        res.json({ success: false, message: 'Insuffcient Permissions!'});
      } else {
        next();
      }
    } else {
      res.json({ success: false, message: 'User not found!'});
    }
  });
};
var verifyteacher = function (req, res, next) {
  User.findOne({ username: req.decoded.username}, function (err, user) {
    if (err) {
      res.json({ success: false, message: err});
    } else if (user) {
      if ( user.permission !== 'teacher') {
        res.json({ success: false, message: 'Insuffcient Permissions!'});
      } else {
        next();
      }
    } else {
      res.json({ success: false, message: 'User not found!'});
    }
  });
};
var verifyadmin = function (req, res, next) {
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
      res.json({ success: false, message: 'User not found!'})
    }
  });
};

var findSemester = function (obj, num) {
  var sem = obj.filter(function (obj) {
    return obj.SemNumber == num;
  })[0];
  return sem;
};

apiRoute.route('/createsubject')
.all(verifyuser,verifyteacher)
.post(function (req, res) {
  var detail = req.body;
  connection.query('INSERT INTO sub_details (Subname,Subcode,Maxtheory,Maxquiz,Maxtotal,username,semester) values (?,?,?,?,?,?,?)',
  [detail.subjectname,detail.subjectcode,parseFloat(detail.theorymax),parseFloat(detail.quizmax),parseFloat(detail.totalmax),req.decoded.username,detail.sem], function(err,result){
    if (err) {
      res.json({success: false,message: err})
    } else {
      connection.query('select max(id) from sub_details',function (err,results) {
        if (err) {
          console.log(err);
          res.json({success: false,message: err});
        } else {
          console.log(results);
          res.json({success: true, message: "Subject Created Successfully!"});
        }
      });
    }
  });
});

apiRoute.route('/getsubjects')
.all(verifyuser,verifyteacher)
.get(function (req, res) {
  connection.query('Select * from sub_details where username = ?',[req.decoded.username],function (err,results) {
    if (err) {
      res.json({success: false, message: err })
    } else {
      console.log(results);
      res.json({ success: true, message: results });
    }
  });
});

apiRoute.route('/updatemarks')
.all(verifyuser,verifyteacher)
.post(function (req, res) {
  var subjectdetails = JSON.parse(req.body.details);
   async.each(req.body.file, function (detail, callback) {
     if (detail.username) {
       connection.query('select * from subject where username = ? and sub_id = ?',[detail.username,subjectdetails.id],function (err,resu) {
         if (err) {
           callback(err);
         } else {
           if(resu.length === 1)
           {
             if(req.body.Cie == 1) {
               connection.query('Insert into cie (theory,quiz,total) values (?,?,?)',[parseFloat(detail.theory),parseFloat(detail.quiz),parseFloat(detail.total)],function (err,results2) {
                 if (err) {
                   callback(err);
                 } else {
                  //results2.insertId
                   connection.query('update subject set cie1 = ? where username = ? and sub_id = ?',[results2.insertId,detail.username,subjectdetails.id],function (err,results3) {
                     if (err) {
                       callback(err);
                     } else {
                       callback();
                     }
                   });
                 }
               });
             } else if (req.body.Cie==2) {
               connection.query('Insert into cie (theory,quiz,total) values (?,?,?)',[parseFloat(detail.theory),parseFloat(detail.quiz),parseFloat(detail.total)],function (err,results2) {
                 if (err) {
                   callback(err);
                 } else {
                   //results2.insertId
                   connection.query('update subject set cie2 = ? where username = ? and sub_id = ?',[results2.insertId,detail.username,subjectdetails.id],function (err,results3) {
                     if (err) {
                       callback(err);
                     } else {
                       callback();
                     }
                   });
                 }
               });
             } else {
               connection.query('Insert into cie (theory,quiz,total) values (?,?,?)',[parseFloat(detail.theory),parseFloat(detail.quiz),parseFloat(detail.total)],function (err,results2) {
                 if (err) {
                   callback(err);
               } else {
                 //results2.insertId
                   connection.query('update subject set cie3 = ? where username = ? and sub_id = ?',[results2.insertId,detail.username,subjectdetails.id],function (err,results3) {
                     if (err) {
                       callback(err);
                     } else {
                       callback();
                     }
                   });
                 }
               });
             }
             //ALREADY RECORDS EXISTS
           } else {
             if(req.body.Cie == 1) {
               connection.query('Insert into cie (theory,quiz,total) values (?,?,?)',[parseFloat(detail.theory),parseFloat(detail.quiz),parseFloat(detail.total)],function (err,results2) {
                 if (err) {
                   callback(err);
                 } else {
                  //results2.insertId
                   connection.query('Insert into subject (username,cie1,sem,sub_id) values (?,?,?,?)',[detail.username,results2.insertId,subjectdetails.semester,subjectdetails.id],function (err,results3) {
                     if (err) {
                       callback(err);
                     } else {
                       connection.query('Insert into teacher_subject (username,sub_details_id,sub_id) values (?,?,?)',[req.decoded.username,subjectdetails.id,results3.insertId],function (err,results4) {
                         if (err) {
                           callback(err)
                         } else {
                           callback();
                         }
                       });
                     }
                   });
                 }
               });
             } else if (req.body.Cie==2) {
               connection.query('Insert into cie (theory,quiz,total) values (?,?,?)',[parseFloat(detail.theory),parseFloat(detail.quiz),parseFloat(detail.total)],function (err,results2) {
                 if (err) {
                   callback(err);
                 } else {
                   //results2.insertId
                   connection.query('Insert into subject (username,cie2,sem,sub_id) values (?,?,?,?)',[detail.username,results2.insertId,subjectdetails.semester,subjectdetails.id],function (err,results3) {
                     if (err) {
                       callback(err);
                     } else {
                       connection.query('Insert into teacher_subject (username,sub_details_id,sub_id) values (?,?,?)',[req.decoded.username,subjectdetails.id,results3.insertId],function (err,results4) {
                         if (err) {
                           callback(err)
                         } else {
                           callback();
                         }
                       });
                     }
                   });
                 }
               });
             } else {
               connection.query('Insert into cie (theory,quiz,total) values (?,?,?)',[parseFloat(detail.theory),parseFloat(detail.quiz),parseFloat(detail.total)],function (err,results2) {
                 if (err) {
                   callback(err);
               } else {
                 //results2.insertId
                   connection.query('Insert into subject (username,cie3,sem,sub_id) values (?,?,?,?)',[detail.username,results2.insertId,subjectdetails.semester,subjectdetails.id],function (err,results3) {
                     if (err) {
                       callback(err);
                     } else {
                       connection.query('Insert into teacher_subject (username,sub_details_id,sub_id) values (?,?,?)',[req.decoded.username,subjectdetails.id,results3.insertId],function (err,results4) {
                         if (err) {
                           callback(err)
                         } else {
                           callback();
                         }
                       });
                     }
                   });
                 }
               });
             }
             //NO RECORDS
           }
          }
       })
     } else {
       callback();
     }
 },function (err) {
   if (err) {
     res.json({success: false, message: err});
   } else {
     res.json({success: true, message: 'Successfully Updated the marks!!'});
   }
 });
});

// MULTIPLE QUERIES
// var query = connection.query('Insert into subject (username,cie1,sem) values (?,?,?);Insert into teacher_subject (username,sub_details_id,sub_id) values (?,?,?)',[detail.username,results2.insertId,subjectdetails.semester,req.decoded.username,subjectdetails.id,results2.insertId]);
// query
//   .on('fields',function (fields, index) {
//     console.log(fields,index);
//   })
//   .on('result',function (row,index) {
//     console.log(row,index);
//   });


apiRoute.route('/getmarks')
.all(verifyuser,verifystudent)
.get(function (req,res) {
  var payload= [[],[],[],[],[],[],[],[]];
  connection.query('Select * from subject where username = ? ',[req.decoded.username],function (err,result) {
    if (err) {
      res.json({success: false, message: err});
    } else {
      async.each(result,function (resu,callback) {
        if (resu.id) {
          var subject = [];
          connection.query('select * from cie where cie_id in (?,?,?);select * from sub_details where id = ?',[resu.cie1,resu.cie2,resu.cie3,resu.sub_id],function (err,result1) {
            if (err) {
              callback(err);
            } else {
              payload[resu.sem].push(result1);
              callback();
            }
          });
        } else {
          callback();
        }
      },function (err) {
        if (err) {
          res.json({success: false, message: err});
        } else {
          console.log(payload);
          res.json({success: true, message: payload});
        }
      })
    }
  })
});




module.exports = apiRoute;
