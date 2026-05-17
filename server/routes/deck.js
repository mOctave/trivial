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

const express = require("express");
const Deck = require("../models/Deck");
const { star, unstar } = require("../controllers/deck");
const router = express.Router();

router.post("/add", async (req, res) => {
	try {
		const deck = await Deck.create(req.body);
		res.status(201).json(deck);
		console.log(`Created deck "${req.body.name}".`);
	} catch (e) {
		res.status(500).json({error: e.message});
		console.log(e);
	}
});

router.delete("/remove", async (req, res) => {
	try {
		Deck.deleteOne({_id: req.body.id});
		console.log(`Removed deck with ID ${req.body.id}.`);
		res.status(200).json({id: req.body.id});
	} catch (e) {
		res.status(500).json({error: e.message});
		console.log(e);
	}
});

router.delete("/clear", async (req, res) => {
	try {
		await Deck.deleteMany({});
		console.log(`Cleared all decks.`);
		res.status(200).json();
	} catch (e) {
		res.status(500).json({error: e.message});
		console.log(e);
	}
});

router.get("/list", async (req, res) => {
	try {
		const decks = await Deck.find();
		res.status(200).json(decks);
	} catch (e) {
		res.status(500).json({error: e.message});
		console.log(e);
	}
});

router.post("/star/:id", async (req, res) => {
	star(req, res);
});

router.post("/unstar/:id", async (req, res) => {
	unstar(req, res);
});

module.exports = router;
