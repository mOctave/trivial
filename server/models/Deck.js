const mongoose = require("mongoose");

const DeckSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	cards: {
		type: [mongoose.Schema.Types.ObjectId],
		required: true,
		default: []
	},
	stars: {
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

module.exports = mongoose.model("Deck", DeckSchema);
