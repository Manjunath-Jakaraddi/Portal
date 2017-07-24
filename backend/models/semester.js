var mongoose         =   require('mongoose');
var Schema           =   mongoose.Schema;
var titlize          =   require('mongoose-title-case');
var validate         =   require('mongoose-validator');
var Float            =   require('mongoose-float').loadType(mongoose);
var SubjectModule    =   require('./subject.js');

var Subject = SubjectModule.Subject;

var SemSchema = new Schema({
  Subjects  :   [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
  SemNumber :   { type: Number, min:1, max:8, unique:true, required:true },
  Sgpa      :   { type: Float }
}, { timestamps: true}
);

module.exports = {
  Sem: mongoose.model('Sem',SemSchema),
  SemSchema: SemSchema
};
