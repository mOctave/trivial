const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
	winner: {
		type: String,
		required: false
	},
	players: [{
		name: {type: String, required: true},
		deck: {type: mongoose.Schema.Types.ObjectId, ref: "Deck", required: false},
		score: {type: Number, required: true, default: 0}
	}],
	nextPlayer: {
		type: Number,
		required: true,
		default: 0
	},
	hasStarted: {
		type: Boolean,
		required: true,
		default: false
	},
	hasFinished: {
		type: Boolean,
		required: true,
		default: false
	},
	currentCard: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Card",
		required: false
	}
});

module.exports = mongoose.model("Game", GameSchema);
