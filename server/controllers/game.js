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

const Card = require("../models/Card");
const Deck = require("../models/Deck");
const Game = require("../models/Game");
const User = require("../models/User");
const authorize = require("../services/authorize");
const registerAction = require("../services/registeraction");


async function drawCard(game) {
	game.nextPlayer = (game.nextPlayer + 1) % game.players.length;
	game.currentCard = await chooseCard(game);
	game.save();
	console.log(game);
}

async function chooseCard(game) {
	const deckType = game.mode.split("/")[1];
	if (deckType == "byod-any" || deckType == "byod-official") {
		const deck = await Deck.findById(game.players[game.nextPlayer].deck);
		const cardId = deck.cards[Math.floor(Math.random() * deck.cards.length)];
		return await Card.findById(cardId);
	} else {
		throw new Error("TAG-BASED GAMES NOT IMPLEMENTED YET");
	}
}

async function hostCustomGame(req, res) {
	try {
		const gamemode = req.body.gamemode;
		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});


		if (!user) {
			return res.status(401).send();
		}

		registerAction(user.name);

		const params = {
			players: [{name: user.name, deck: await Deck.findOne()._id /* TODO */, score: 0}],
			mode: gamemode
		}

		const game = await Game.create(params);
		console.log(`Created new game with gamemode ${gamemode}`);
		return res.status(201).redirect(`/play/${game._id}`);
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

async function displayGame(req, res) {
	try {
		const game = await Game.findById(req.params.id);

		if (game.isFinished) {
			// Game is finished
			// TODO
			return res.status(200).render("pages/game-archive");
		}

		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		registerAction(user.name);

		const players = game.players;

		let pNum = -1;
		for (const i in players) {
			if (players[i].name === user.name) {
				pNum = i;
				break;
			}
		}

		if (pNum === -1) {
			// User is not a player

			if (game.hasStarted) {
				// Game is underway, therefore inaccessible
				return res.status(403).render("errors/403");
			} else {
				// User can join the game!
				game.players.push({name: user.name, deck: await Deck.findOne()._id /* TODO */, score: 0});
				await game.save();
				return res.status(200).render("pages/game-wait", {game: game, activeUser: user, loggedIn: true});
			}
		}

		if (game.hasStarted) {
			// User is a player, the game is currently ongoing
			return res.status(200).render("pages/game-active", {game: game, activeUser: user, loggedIn: true});
		}
		// User is a player, the game is waiting to start
		return res.status(200).render("pages/game-wait", {game: game, activeUser: user, loggedIn: true});
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

async function getInfo(req, res) {
	try {
		res.status(200).json({game: await Game.findById(req.params.id)});
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

async function startGame(req, res) {
	try {
		const game = await Game.findById(req.params.id);

		if (game.hasStarted) {
			// Game has already started
			return res.status(400).send();
		}

		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		registerAction(user.name);

		if (user.name === game.players[0].name) {
			game.hasStarted = true;
			await game.save();
			return res.status(200).send();
		} else {
			return res.status(403).send();
		}
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

module.exports = { hostCustomGame, displayGame, getInfo, startGame };
