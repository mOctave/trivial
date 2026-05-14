const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
	winner: {
		type: String,
		required: false
	},
	players: [{
		name: {type: String, required: true},
		deck: {type: String, required: false},
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
	}
});

module.exports = mongoose.model("User", UserSchema);
