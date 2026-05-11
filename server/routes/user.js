const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/add", async (req, res) => {
	try {
		const user = await User.create(req.body);
		res.status(201).json(user);
		console.log(`Created user "${req.body.name}".`);
	} catch (e) {
		res.status(500).json({error: e.message});
		console.log(e);
	}
});

router.delete("/remove", async (req, res) => {
	try {
		User.deleteOne({_id: req.body.id});
		console.log(`Removed user with ID ${req.body.id}.`);
		res.status(200).json({id: req.body.id});
	} catch (e) {
		res.status(500).json({error: e.message});
		console.log(e);
	}
});


router.delete("/clear", async (req, res) => {
	try {
		await User.deleteMany({});
		console.log(`Cleared all users.`);
		res.status(200).json();
	} catch (e) {
		res.status(500).json({error: e.message});
		console.log(e);
	}
});

router.get("/list", async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (e) {
		res.status(500).json({error: e.message});
		console.log(e);
	}
});

module.exports = router;
