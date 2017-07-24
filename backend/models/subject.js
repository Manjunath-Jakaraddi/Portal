var mongoose   =   require('mongoose');
var Schema     =   mongoose.Schema;
var titlize    =   require('mongoose-title-case');
var validate   =   require('mongoose-validator');
var Float      =   require('mongoose-float').loadType(mongoose);
var User       =   require('./user.js');

var CieSchema = new Schema({
  cienumber : { type:Number, required:true },
  theory    : { type : Float, required: true },
  quiz      : { type : Float, required: true },
  total     : { type : Float, required: true },
  absent    : { type: Boolean, default : true }
}, { timestamps: true }
);

var MaxCie = {
  theory  :   { type: Number, required: true },
  quiz    :   { type:Number, required: true },
  total   :   { type: Number, required: true }
};

var SubjectSchema = new Schema({
    studentid :   { type: Schema.Types.ObjectId, ref: 'User' },
    teacherid :   { type: Schema.Types.ObjectId, ref: 'User' },
    Subname   :   { type : String, required : true },
    Subcode   :   { type : String, required : true },
    CieMax    :   MaxCie,
    CieMarks  :   [CieSchema]
    // CieLab    :   {
    //     Max      : { type : Number, default : 50 },
    //     LabMarks : { type: Float, max:50, min:0, default:0, required: true },
    //     Attendance to be maintained here
    //     absent   : { type : Boolean, default : false }
    // }
}, { timestamps: true }
);

module.exports  =   {
  Cie : mongoose.model('Cie', CieSchema),
  SubjectSchema: SubjectSchema,
  Subject: mongoose.model('Subject', SubjectSchema)
};
