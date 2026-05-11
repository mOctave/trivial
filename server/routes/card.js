const express = require("express");
const Card = require("../models/Card");
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

module.exports = router;
