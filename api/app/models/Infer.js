var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var InferSchema   = new Schema({

	date: Date,
	image: String,
	results: Array

});


module.exports = mongoose.model('Inferences', InferSchema);