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

		if (!user) {
			return res.status(401).send();
		}
		
		const deck = await Deck.findById(id);

		if (user.decksStarred.includes(id)) {
			return res.status(400).send();
		} else {
			user.decksStarred.push(id);
			await user.save();
			deck.stars++;
			await deck.save();
			return res.status(200).send();
		}
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

async function unstar(req, res) {
	try {
		const id = req.params.id;
		await authorize(req, res, false);

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		const deck = await Deck.findById(id);

		if (user.decksStarred.includes(id)) {
			user.decksStarred.splice(user.decksStarred.indexOf(id), 1);
			await user.save();
			deck.stars--;
			await deck.save();
			return res.status(200).send();
		} else {
			return res.status(400).send();
		}
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}


async function edit(req, res) {
	try {
		const id = req.params.id;
		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		const deck = await Deck.findById(id);

		if (user.name === deck.creator || user.badges.includes("Admin")) {
			console.log(`Authorized edits to deck ${id}.`);
			deck.name = req.body.name;
			deck.save();
			return res.status(200).redirect(`/deck/${id}`);
		} else {
			return res.status(403).render("errors/403");
		}
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

async function destroy(req, res) {
	try {
		const id = req.params.id;
		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		const deck = await Deck.findById(id);

		if (user.name === deck.creator || user.badges.includes("Admin")) {
			console.log(`Authorized deletion of deck ${id}.`);
			await Deck.deleteOne({_id: id});
			return res.status(200).send();
		} else {
			return res.status(403).render("errors/403");
		}
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

async function checkModifiable(req, res) {
	try {
		await authorize(req, res, true);

		if (req.user == null) {
			return res.status(200).json({"modifiableDecks": []});
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		if (user.badges.includes("Admin")) {
			return res.status(200).json({"modifiableDecks": await Deck.find({}).then((x) => {return x})});
		}

		return res.status(200).json({"modifiableDecks": await Deck.find({"creator": user.name}).then((x) => {return x})});
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

async function addCards(req, res) {
	try {
		const deckId = req.body.deck;
		const cardIds = req.body.cards;
		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		const deck = await Deck.findById(deckId);

		if (user.name === deck.creator || user.badges.includes("Admin")) {
			for (const cardId of cardIds) {
				if (!deck.cards.includes(cardId)) {
					console.log(`Added card ${cardId} to deck ${deckId}.`);
					deck.cards.push(cardId);
				}
				deck.save();
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

module.exports = { star, unstar, edit, destroy, checkModifiable, addCards };
