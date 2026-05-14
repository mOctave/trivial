const express = require("express");
const { logout } = require("../controllers/login");
const showpage = require("../controllers/pagedisplay");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
	showpage("pages/index", req, res);
});

router.get("/home", async (req, res) => {
	showpage("pages/home", req, res);
});

router.get("/login", async (req, res) => {
	showpage("pages/login", req, res);
});

router.get("/logout", async (req, res) => {
	logout(req, res);
});

router.get("/terms", async (req, res) => {
	showpage("pages/terms", req, res);
});

router.get("/privacy", async (req, res) => {
	showpage("pages/privacy", req, res);
});

router.get("/user/:target", async (req, res) => {
	showpage("pages/user", req, res);
});

router.get("/deck/:target", async (req, res) => {
	showpage("pages/deck", req, res);
});

router.get("/*splat", async (req, res) => {
	showpage("errors/404", req, res);
});

module.exports = router;
