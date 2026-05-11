const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
	question: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: false
	},
	answer: {
		type: String,
		required: true
	},
	typeins: {
		type: [String],
		required: true,
		default: []
	},
	tags: {
		type: [String],
		required: true,
		default: []
	},
});

module.exports = mongoose.model("Card", CardSchema);
