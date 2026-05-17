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

const Deck = require("../models/Deck");
const User = require("../models/User");
const authorize = require("../services/authorize");

async function star(req, res) {
	try {
		const id = req.params.id;
		await authorize(req, res, false);

		const user = await User.findOne({"name": req.user.name});
		const deck = await Deck.findById(id);

		if (user.decksStarred.includes(id)) {
			return res.status(400);
		} else {
			user.decksStarred.push(id);
			await user.save();
			deck.stars++;
			await deck.save();
		}
	} catch (e) {
		res.status(500);
		console.log(e);
	}
}

async function unstar(req, res) {
	try {
		const id = req.params.id;
		await authorize(req, res, false);

		const user = await User.findOne({"name": req.user.name});
		const deck = await Deck.findById(id);

		if (user.decksStarred.includes(id)) {
			user.decksStarred.splice(user.decksStarred.indexOf(id), 1);
			await user.save();
			deck.stars--;
			await deck.save();
		} else {
			return res.status(400);
		}
	} catch (e) {
		res.status(500);
		console.log(e);
	}
}

module.exports = { star, unstar };
