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

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	pfp: {
		type: String,
		required: true,
		default: "/img/favicon.svg"
	},
	decksCreated: {
		type: [String],
		required: true,
		default: []
	},
	decksStarred: {
		type: [String],
		required: true,
		default: []
	},
	dateCreated: {
		type: Date,
		required: true,
		default: () => new Date()
	},
	dateActive: {
		type: Date,
		required: true,
		default: () => new Date()
	},
	rating: {
		type: Number,
		required: true,
		default: 100
	},
	badges: {
		type: [String],
		required: true,
		default: ["Trivialist"]
	},
	cardsAnswered: {
		type: [String],
		required: true,
		default: []
	}
});

module.exports = mongoose.model("User", UserSchema);
