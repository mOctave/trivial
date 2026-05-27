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
const { body, validationResult } = require("express-validator");
const Game = require("../models/Game");
const { hostCustomGame, getInfo, startGame, submitAnswer } = require("../controllers/game");
const router = express.Router();

router.post("/host", async (req, res) => {
	console.log("Attempting to host");
	hostCustomGame(req, res);
});

router.get("/info/:id", async (req, res) => {
	getInfo(req, res);
});

router.post("/start/:id", async (req, res) => {
	console.log(`Starting game ${req.params.id}`);
	startGame(req, res);
});

router.post("/answer/:id", async (req, res) => {
	console.log(`Answering game ${req.params.id}`);
	submitAnswer(req, res);
});

module.exports = router;
