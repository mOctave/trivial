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
