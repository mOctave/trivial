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
		console.log(e);
		return res.status(500).send();
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
		console.log(e);
		return res.status(500).send();
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
			deck.description = req.body.description;
			deck.save();
			return res.status(200).redirect(`/deck/${id}`);
		} else {
			return res.status(403).render("errors/403");
		}
	} catch (e) {
		console.log(e);
		return res.status(500).send();
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
							
			// Remove references to deck
			for (const user of await User.find({"decksStarred": id})) {
				console.log(`Deleting reference: ${user.name}`);
				user.decksStarred.splice(user.decksStarred.indexOf(id), 1);
				user.save();
			}
			
			return res.status(200).send();
		} else {
			return res.status(403).render("errors/403");
		}
	} catch (e) {
		console.log(e);
		return res.status(500).send();
	}
}

async function checkModifiable(req, res) {
	try {
		await authorize(req, res, false);
		console.log("[MODCHECK AUTHORIZED]");

		if (req.user == null) {
			console.log("[MODCHECK NO USER - BRANCH A]");
			return res.status(200).json({"modifiableDecks": []});
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			console.log("[MODCHECK NO USER - BRANCH B]");
			return res.status(200).json({"modifiableDecks": []});
		}

		if (user.badges.includes("Admin")) {
			console.log("[MODCHECK ADMIN]");
			return res.status(200).json({"modifiableDecks": await Deck.find({})});
		}

		console.log("[MODCHECK NON-ADMIN]");
		return res.status(200).json({"modifiableDecks": await Deck.find({"creator": user.name})});
	} catch (e) {
		console.log("[MODCHECK FAIL]");
		console.log(e);
		return res.status(500).send();
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
			}
			deck.save();
			return res.status(201).send();
		} else {
			return res.status(403).render("errors/403");
		}
	} catch (e) {
		console.log(e);
		return res.status(500).send();
	}
}

async function removeCards(req, res) {
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
			const newCards = [];
			for (const oldId of deck.cards) {
				if (cardIds.includes(oldId)) {
					console.log(`Removed card ${oldId} from deck ${deckId}`);
				} else {
					newCards.push(oldId);
				}
			}
			deck.cards = newCards;
			deck.save();
			return res.status(200).send();
		} else {
			return res.status(403).render("errors/403");
		}
	} catch (e) {
		console.log(e);
		return res.status(500).send();
	}
}

async function create(req, res) {
	try {
		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		const params = {
			name: req.body.name,
			description: req.body.description,
			image: "/img/favicon.svg",
			creator: user.name
		};

		const deck = await Deck.create(params); 
		console.log(`User ${user.name} created deck ${deck._id}.`);
		return res.status(200).redirect(`/deck/${deck._id}`);
	} catch (e) {
		console.log(e);
		return res.status(500).send();
	}
}

async function importJSON(req, res) {
	try {
		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		const cards = [];
		if (req.body.cards) {
			for (const cardEntry of req.body.cards) {
				const cardParams = {
					question: cardEntry.question ? cardEntry.question : "ERROR: No question provided.",
					image: cardEntry.image ? cardEntry.image : undefined,
					answer: cardEntry.answer ? cardEntry.answer : "ERROR: No answer provided.",
					typeins: cardEntry.typeins ? cardEntry.typeins : [],
					tags: (cardEntry.tags && user.badges.includes("Admin")) ? cardEntry.tags : [],
					creator: user.name
				};

				const card = await Card.create(cardParams);
				cards.push(card);
			}
		}

		const deckParams = {
			name: req.body.name ? req.body.name : `${user.name}'s Imported Deck`,
			description: req.body.description ? req.body.description : "This deck has no description.",
			image: req.body.image ? req.body.image : "/img/favicon.svg",
			creator: user.name,
			cards: cards
		};

		const deck = await Deck.create(deckParams); 
		console.log(`User ${user.name} imported deck ${deck._id} with ${cards.length} new cards.`);

		return res.status(200).redirect(`/deck/${deck._id}`);
	} catch (e) {
		console.log(e);
		return res.status(500).send();
	}
}

module.exports = { star, unstar, edit, destroy, checkModifiable, addCards, removeCards, create, importJSON };
