/*
Trivial: Multiplayer trivia online.
Copyright (C) 2026 mOctave

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
	winner: {
		type: String,
		required: false
	},
	players: [{
		name: {type: String, required: true},
		deck: {type: mongoose.Types.ObjectId, ref: "Deck", required: false},
		score: {type: Number, required: true, default: 0},
		roundScore: {type: Number, required: true, default: 0},
		lastAnswer: {type: String, required: false}
	}],
	nextPlayer: {
		type: Number,
		required: true,
		default: -1
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
		type: mongoose.Types.ObjectId,
		ref: "Card",
		required: false
	},
	timeout: {
		type: Date,
		required: true,
		default: () => new Date(new Date().getTime() + 15 * 60 * 1000)
	},
	totalTimeoutLength: {
		type: Number,
		required: true,
		default: 15 * 60 * 1000
	},
	options: {
		style: {type: String, required: true, default: "duel"},
		cardChoice: {type: String, required: true, default: "byod-unlimited"},
		roundLength: {type: Number, required: true, default: 20},
		pauseLength: {type: Number, required: true, default: 5},
		targetScore: {type: Number, required: true, default: 100}
	},
	roundActive: {
		type: Boolean,
		required: true,
		default: false
	}
});

module.exports = mongoose.model("Game", GameSchema);
