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

const Card = require("../models/Card");
const User = require("../models/User");
const authorize = require("../services/authorize");
const hasPermission = require("../services/tagperms");

async function batchApplyTag(req, res) {
	try {
		const tag = req.body.tag;
		const cardIds = req.body.cards;
		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		if (hasPermission(tag, user)) {
			for (const cardId of cardIds) {
				const card = await Card.findById(cardId);
				if (!card.tags.includes(tag)) {
					console.log(`Added tag ${tag} to card ${cardId}.`);
					card.tags.push(tag);
				}
				card.save();
			}
			return res.status(201).send();
		} else {
			return res.status(403).render("errors/403");
		}
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

async function batchRemoveTag(req, res) {
	try {
		const tag = req.body.tag;
		const cardIds = req.body.cards;
		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		if (hasPermission(tag, user)) {
			for (const cardId of cardIds) {
				const card = await Card.findById(cardId);
				if (card.tags.includes(tag)) {
					console.log(`Added tag ${tag} to card ${cardId}.`);
					card.tags.splice(card.tags.indexOf(tag), 1);
				}
				card.save();
			}
			return res.status(200).send();
		} else {
			return res.status(403).render("errors/403");
		}
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

async function batchDestroy(req, res) {
	try {
		const cardIds = req.body.cards;
		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		for (const cardId of cardIds) {
			const card = await Card.findById(cardId);

			if (user.name === card.creator || user.badges.includes("Admin")) {
				console.log(`Deleted card ${cardId}.`);
				// Remove references to card
				for (const deck of await Deck.aggregate([
					{$unwind: "$cards"},
					{$match: {"cards": cardId}}
				])) {
					deck.cards.splice(deck.cards.indexOf(cardId), 1);
				}
				
				// Actually delete the card
				await Card.findByIdAndDelete(cardId);
			}
			return res.status(200).send();
		}
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

module.exports = { batchApplyTag, batchRemoveTag, batchDestroy };
