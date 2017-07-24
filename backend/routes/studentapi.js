var express           =   require('express')
var bodyParser        =   require('body-parser');
var mongoose          =   require('mongoose');
var config            =   require('../../config');
var jwt               =   require('jsonwebtoken');
var SubjectModule     =   require('../models/subject.js');
var Semester          =   require('../models/semester');
var User              =   require('../models/user.js');
var teacher           =   require('../models/teacher.js');
const async           =   require('async');

var Subject = SubjectModule.Subject;
var SubjectSchema = SubjectModule.SubjectSchema;

var Cie = SubjectModule.Cie;

var Sem = Semester.Sem;
var SemSchema = Semester.SemSchema;
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
  var subdetails = new SubjectDetails();
  subdetails.Subname = req.body.subjectname;
  subdetails.Subcode = req.body.subjectcode;
  subdetails.semester = req.body.sem;
  subdetails.Max.theory = req.body.theorymax;
  subdetails.Max.quiz = req.body.quizmax;
  subdetails.Max.total = req.body.totalmax;
  User.findOne({ username: req.decoded.username }).select('subjectdetails').exec(function (err, user) {
    if (err) {
      res.json({ success: false, message: err });
    } else if (!user) {
      res.json({ success: false, message: "User not found!" });
    } else {
      user.subjectdetails.push(subdetails);
      user.save(function (err) {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          res.json({ success: true, message: 'Subject created successfully!' });
        }
      });
    }
  });
});

apiRoute.route('/getsubjects')
.all(verifyuser,verifyteacher)
.get(function (req, res) {
  User.findOne({username: req.decoded.username }).select('subjectdetails').exec(function (err, user) {
    if (err) {
      res.json({ success: false, message: err });
    } else if (!user) {
      res.json({ success: false, message: "User not found!" });
    } else {
      res.json({ success: true, message: user.subjectdetails });
    }
  })
});

apiRoute.route('/updatemarks')
.all(verifyuser,verifyteacher)
.post(function (req, res) {
  User.findOne({ username: req.decoded.username }).select('subjectdetails').exec(function (err, teacheruser) {
    if (err) {
      res.json({ success: false, message: err });
    } else if (!teacheruser) {
      res.json({ success: false, message: 'Teacheruser not found!'});
    } else {
      var details = JSON.parse(req.body.details);
      var sem = details.semester -1;
      var pos = teacheruser.subjectdetails.map(function(e) { return e.Subcode; }).indexOf(details.Subcode);

      // user.semesters[sem].Subjects  push the subject id
      // teacheruser.subjectdetails[pos].Subjects  push the subject id
      // save the subject student user and the teacher user atlast only once


      async.each(req.body.file, function (detail, callback) {
        if (detail.username) {
          User.findOne({ username: detail.username }).select('semesters').exec(function (err, user) {
            if (err) {
              callback(err);
            } else if (!user) {
              callback("User not found!");
            } else {
              Subject.find({$and : [{studentid: user._id},{teacherid: teacheruser._id},{ Subcode: details.Subcode }]}).exec(function (err, sub) {
                if (err) {
                  callback(err);
                } else if (sub.length === 0) {
                  console.log("not found!");
                  var subject = new Subject();
                  subject.studentid = user._id;
                  subject.teacherid = teacheruser._id;
                  subject.Subname = details.Subname;
                  subject.Subcode = details.Subcode;
                  subject.CieMax = details.Max;
                  var cie = {};
                  cie.theory = parseFloat(detail.theory);
                  cie.quiz = parseFloat(detail.quiz);
                  cie.total = parseFloat(detail.total);
                  cie.absent = false;
                  cie.cienumber = req.body.Cie;
                  user.semesters[sem].Subjects.push(subject._id);//Pushing in student
                  subject.CieMarks.push(cie);
                  teacheruser.subjectdetails[pos].Subjects.push(subject._id);//Pushing in teacher
                  // Saving Student and subject
                  subject.save(function (err) {
                    if (err) {
                      callback(err);
                    } else {
                      user.save(function (err) {
                        if (err) {
                          callback(err)
                        } else {
                          callback();
                        }
                      });
                    }
                  });
                  // End of saving
                } else {
                  console.log("sub found!");
                  callback();
                }
              });
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
          teacheruser.save(function (err) {
            if (err) {
              res.json({ success: false, message: err });
            } else {
              res.json({ success: true, message: 'Updated marks successfully!'});
            }
          });
        }
      });
    }
  });
});




apiRoute.route('/show/:id')
.get(function (req,res) {
  User.findOne({ _id : req.params.id }).select('semesters').populate('semesters.Subjects').exec(function (err,data) {
    if (err) {
      res.json({message: err});
    } else {
      res.json(data);
      // Subject.findOne({ _id: data.semesters[3].Subjects[0]}).exec(function (err, sub) {
      //   res.json(sub);
      // });
    }
  })
});




module.exports = apiRoute;
