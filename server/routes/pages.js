const express = require("express");
const showpage = require("../services/showpage");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
	showpage("pages/index", res);
});

router.get("/home", async (req, res) => {
	showpage("pages/home", res);
});

router.get("/*splat", async (req, res) => {
	showpage("errors/404", res);
});

module.exports = router;
