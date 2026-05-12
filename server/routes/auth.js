const express = require("express");
const { body, validationResult } = require("express-validator");
const { register, login } = require("../controllers/login");
const authorize = require("../services/authorize");
const router = express.Router();

router.post("/register",
	body("name").trim().escape(),
	body("password").escape(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({errors: errors.array()});
		}
		register(req, res);
	}
);


router.post("/login",
	body("name").trim().escape(),
	body("password").escape(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({errors: errors.array()});
		}
		login(req, res);
	}
);

module.exports = router;
