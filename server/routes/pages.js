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
const { logout } = require("../controllers/login");
const showpage = require("../controllers/pagedisplay");
const User = require("../models/User");
const { displayGame } = require("../controllers/game");
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

router.get("/cards", async (req, res) => {
	showpage("pages/cards", req, res);
});

router.get("/user/:target", async (req, res) => {
	showpage("pages/user", req, res);
});

router.get("/deck/:target", async (req, res) => {
	showpage("pages/deck", req, res);
});

router.get("/card/:target", async (req, res) => {
	showpage("pages/card", req, res);
});

router.get("/create", async (req, res) => {
	showpage("pages/create", req, res);
});

router.get("/play", async (req, res) => {
	showpage("pages/play", req, res);
});

router.get("/play/:id", async (req, res) => {
	displayGame(req, res);
});

router.get("/*splat", async (req, res) => {
	showpage("errors/404", req, res);
});

module.exports = router;
