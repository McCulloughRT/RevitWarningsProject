var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/temp');
var Schema = mongoose.Schema;

//create a schema
var emailSchema = new Schema({
	name: String
});

//create a model using the schema
var EmailDB = mongoose.model('tempEmail', emailSchema);

//make this available to our users in node application
module.exports = EmailDB;
