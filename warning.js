var mongoose = require('mongoose');
mongoose.connect('mongodb:// <user> : <password> @ <database>');
var Schema = mongoose.Schema;

//create a schema
var warningSchema = new Schema({
	office: String,
	projID: String,
	projPhase: String,
	uploadTime: Date,
	warningName: String,
	elementTypes: [String]
});

//create a model using the schema
var Warning = mongoose.model('warningDB', warningSchema);

//create a schema
var emailSchema = new Schema({
	name: String,
	club: Number
});

//create a model using the schema
var EmailDB = mongoose.model('emailDB', emailSchema);

//make this available to our users in node application
//module.exports = Warning;

exports.Warning = Warning;
exports.EmailDB = EmailDB;
