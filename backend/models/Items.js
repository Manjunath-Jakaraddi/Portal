var mongoose   =   require('mongoose');
var Schema     =   mongoose.Schema;
var titlize    =   require('mongoose-title-case');
var validate   =   require('mongoose-validator');
var Float      =   require('mongoose-float').loadType(mongoose);
var Items = new Schema({
  itemname: {type: String,unique: true},
  ingrediants : { type: String },
  description : {type: String },
  imageurl: {type : String },
  cost: {type : String},
  offer: {type: String}
},{timestamps: true}
);

module.exports=mongoose.model('Items',Items);
