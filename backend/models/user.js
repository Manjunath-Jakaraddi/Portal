var mongoose          =     require('mongoose');
var Schema            =     mongoose.Schema;
var bcrypt            =     require('bcrypt-nodejs');
var titlize           =     require('mongoose-title-case');
var validate          =     require('mongoose-validator');
var teacher           =     require('./teacher.js');
var SubjectModule    =   require('./subject.js');
var Float            =   require('mongoose-float').loadType(mongoose);


var Subject = SubjectModule.Subject;
var SubjectDetailsSchema  = teacher.SubjectDetailsSchema;


var SemSchema = new Schema({
  Subjects  :   [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
  SemNumber :   { type: Number, min:1, max:8, unique: false, required: true },
  Sgpa      :   { type: Float }
});


var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Name must be at least 3 characters, max 30, no special characters or numbers, must have space in between name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [10, 20],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain letters and numbers only'
    })
];

var emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
        message: 'Email must be at least 3 characters, max 40, no special characters or numbers, must have space in between name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 40],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: 'Password needs to have at least one lower case, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];
var prodSchema = new Schema({
  prodname  : {type: String},
  quantity  : {type: String}
})
var UserSchema = new Schema({
  name            :     { type: String, default: false, validate: nameValidator},
  username        :     { type: String, required: true, unique: true, validate: usernameValidator},
  email           :     { type: String, default: false, unique: true, validate: emailValidator},
  password        :     { type:String, default: false, validate: passwordValidator, select: false},
  active          :     { type: Boolean, default: false },
  registered      :     { type: Boolean, default: false },
  temporarytoken  :     { type: String, default: false},
  resettoken      :     { type: String },
  permission      :     { type: String, default: 'user' },
  city            :     { type: String },
  location        :     { type: String },
  pincode         :     { type: String },
  products        :     [prodSchema]
});

UserSchema.pre('save', function(next) {
  var user = this;

    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.plugin(titlize, {
    paths: ['name']
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',UserSchema);
