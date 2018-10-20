var mongoose     = require('mongoose');

var Schema       = mongoose.Schema;

var AgentSchema   = new Schema({
	host: String,
	date: Date,
});



module.exports = mongoose.model('Agent', AgentSchema);