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
const Card = require("../models/Card");
const { batchApplyTag, batchRemoveTag, batchDestroy } = require("../controllers/card");
const router = express.Router();

router.post("/add", async (req, res) => {
	try {
		const card = await Card.create(req.body);
		res.status(201).json(card);
		console.log(`Created card "${req.body.question}".`);
	} catch (e) {
		res.status(500).json({error: e.message});
		console.log(e);
	}
});

router.delete("/remove", async (req, res) => {
	try {
		Card.deleteOne({_id: req.body.id});
		console.log(`Removed card with ID ${req.body.id}.`);
		res.status(200).json({id: req.body.id});
	} catch (e) {
		res.status(500).json({error: e.message});
		console.log(e);
	}
});


router.delete("/clear", async (req, res) => {
	try {
		await Card.deleteMany({});
		console.log(`Cleared all cards.`);
		res.status(200).json();
	} catch (e) {
		res.status(500).json({error: e.message});
		console.log(e);
	}
});

router.get("/list", async (req, res) => {
	try {
		const cards = await Card.find();
		res.status(200).json(cards);
	} catch (e) {
		res.status(500).json({error: e.message});
		console.log(e);
	}
});

router.post("/batchapplytag", async (req, res) => {
	batchApplyTag(req, res);
});

router.post("/batchremovetag", async (req, res) => {
	batchRemoveTag(req, res);
});

router.post("/batchdelete", async (req, res) => {
	batchDestroy(req, res);
});

module.exports = router;
