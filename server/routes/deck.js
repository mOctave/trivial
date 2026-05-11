const express = require("express");
const Deck = require("../models/Deck");
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

module.exports = router;
