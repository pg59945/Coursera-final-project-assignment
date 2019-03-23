const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	image: {
		type: String,
		required: true,
		unique: true
	},
	designation: {
		type: String,
		required: true,
	},
	abbr: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true
	},
	featured: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

// the schema is useless so far
// we need to create a model using it
const Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;