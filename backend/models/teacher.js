var mongoose   =   require('mongoose');
var Schema     =   mongoose.Schema;
var titlize    =   require('mongoose-title-case');
var validate   =   require('mongoose-validator');
var Float      =   require('mongoose-float').loadType(mongoose);
var SubjectModule    =   require('./subject.js');

var Subject = SubjectModule.Subject;


var SubjectDetailsSchema = new Schema({
  Subname   :   { type : String, required : true },
  Subcode   :   { type : String, required : true },
  Subjects  :   [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
  semester  :   { type: Number, required: true },
  Max       :   {
      theory  :   { type: Number, max: 50, min: 0, required: true },
      quiz    :   { type:Number, default : 15, required: true },
      total   :   { type: Number, max : 45, min : 0, required: true }
   }
});

module.exports = {
  SubjectDetails: mongoose.model('SubjectDetails', SubjectDetailsSchema),
  SubjectDetailsSchema: SubjectDetailsSchema
};
