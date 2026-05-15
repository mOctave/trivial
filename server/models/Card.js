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
	correct: {
		type: Number,
		required: true,
		default: 0
	},
	presentations: {
		type: Number,
		required: true,
		default: 0
	},
	creator: {
		type: String,
		required: true,
		default: "Trivial"
	},
	dateCreated: {
		type: Date,
		required: true,
		default: () => new Date()
	},
	dateModified: {
		type: Date,
		required: true,
		default: () => new Date()
	}
});

module.exports = mongoose.model("Card", CardSchema);
