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

const gameRoundLength = 20000;
const gameScoreLimit = 100;
const gamePauseLength = 5000;

const timeouts = {};

async function startRound(gameId) {
	await drawCard(gameId);
	const game = await Game.findById(gameId);
	game.timeout = new Date(new Date().getTime() + gameRoundLength);
	game.totalTimeoutLength = gameRoundLength;
	for (const player of game.players) {
		player.lastAnswer = "--";
		player.roundScore = 0;
	}
	game.roundActive = true;
	await game.save();
	timeouts[gameId] = setTimeout(() => {
		endRound(gameId);
	}, gameRoundLength);
}

async function endRound(gameId) {
	const game = await Game.findById(gameId);

	// Update scores
	for (const player of game.players) {
		player.score += player.roundScore;
	}
	// Check if someone is winning
	let maxWinningScore = gameScoreLimit;
	let maxPlayers = [];
	for (const player of game.players) {
		if (player.score > maxWinningScore) {
			maxWinningScore = player.score;
			maxPlayers = [player.name];
		} else if (player.score == maxWinningScore) {
			maxPlayers.push(player.name);
		}
	}
	// Check if the game is finished
	if (maxPlayers.length === 1) {
		await game.save();
		await finishGame(gameId);
		return;
	}
	// Game isn't finished yet, keep playing.
	game.timeout = new Date(new Date().getTime() + gamePauseLength);
	game.totalTimeoutLength = gamePauseLength;
	game.roundActive = false;
	await game.save();
	timeouts[gameId] = setTimeout(() => {
		startRound(gameId);
	}, gamePauseLength);
}

async function finishGame(gameId) {
	console.log(`Game ${gameId} has finished.`);
	if (timeouts[gameId]) clearTimeout(timeouts[gameId]);
	timeouts[gameId] = undefined;

	const game = await Game.findById(gameId);
	let winningScore = 0;
	let winner = null;
	for (const player of game.players) {
		if (player.score > winningScore) {
			winningScore = player.score;
			winner = player.name;
		}
	}
	game.winner = winner;
	game.hasFinished = true;
	if (game.mode.split("/")[0] === "duel") {
		assignRatingPoints(gameId);
	}
	game.roundActive = false;
	game.timeout = new Date();
	await game.save();
}

async function assignRatingPoints(gameId) {
	console.log("TODO: Assign rating points");
}

async function matchAnswer(gameId, answer) {
	console.log("Matching answer...");
	const game = await Game.findById(gameId);
	const card = await Card.findById(game.currentCard);

	if (!card) {
		return false;
	}

	if (card.answer.toLowerCase() === answer.toLowerCase()) return true;

	for (const typein of card.typeins) {
		const regex = new RegExp(typein, "i");
		if (regex.test(answer)) return true;
	}

	console.log("Failed to match answer.");

	return false;
}

async function drawCard(gameId) {
	const game = await Game.findById(gameId);
	game.nextPlayer = (game.nextPlayer + 1) % game.players.length;

	// Choose card

	const deckType = game.mode.split("/")[1];
	if (deckType == "byod-unlimited" || deckType == "byod-official") {
		let deck = await Deck.findById(game.players[game.nextPlayer].deck);
		if (!deck) {
			deck = await Deck.findOne();
		}
		console.log(`Choosing a card from ${deck._id}`);
		const cardId = await deck.cards[Math.floor(Math.random() * deck.cards.length)];
		console.log(`Chose card ${cardId}`); // TODO: Handle empty decks.
		const card = await Card.findById(cardId);
		card.presentations += game.players.length;
		await card.save();
		game.currentCard = cardId;
		await game.save();
	} else if (deckType == "ama") {
		console.log(`Choosing a random category-tagged card.`);
		let cards = await Card.find({"tags": {$in: [
			"Geography", "History", "Language",
			"Famous People", "Art and Culture", "Sports and Recreation",
			"Science and Technology", "General Knowledge"
		]}});
		const card = await cards[Math.floor(Math.random() * cards.length)];
		console.log(`Chose card ${card._id}`); // TODO: Handle empty categories.
		card.presentations += game.players.length;
		await card.save();
		game.currentCard = card._id;
		await game.save();
	} else {
		const tag = tagNames[deckType];
		console.log(`Choosing a card with the tag "${tag}"`);
		let cards = await Card.find({"tags": tag});
		const card = await cards[Math.floor(Math.random() * cards.length)];
		console.log(`Chose card ${card._id}`); // TODO: Handle empty categories.
		card.presentations += game.players.length;
		await card.save();
		game.currentCard = card._id;
		await game.save();
	}
}

const tagNames = {
	"geography": "Geography",
	"history": "History",
	"language": "Language",
	"famous-people": "Famous People",
	"art-culture": "Art and Culture",
	"sports-rec": "Sports and Recreation",
	"science-tech": "Science and Technology",
	"general-knowledge": "General Knowledge"
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
			players: [{name: user.name, deck: await chooseDeck(req, res, gamemode), score: 0}],
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

		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			if (game.hasFinished) {
				// Players can view past games without logging in
				return res.status(200).render("pages/game-archive", {game: game, activeUser: null, loggedIn: false});
			} else {
				// Players can't view ongoing games unless they log in
				return res.status(403).send();
			}
		}


		if (game.hasFinished) {
			// Game is finished and open to the public
			return res.status(200).render("pages/game-archive", {game: game, activeUser: user, loggedIn: true});
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

				// TODO: Check if the user is already in a game - enforce one user one game limit
				game.players.push({name: user.name, deck: await chooseDeck(req, res, game.mode), score: 0});

				await game.save();
				return res.status(200).render("pages/game-wait", {game: game, activeUser: user, loggedIn: true});
			}
		}

		if (game.hasStarted) {
			// User is a player, the game is currently ongoing
			const card = await Card.findById(game.currentCard);
			return res.status(200).render("pages/game-active", {
				game: game, 
				question: card ? card.question : null,
				image: card ? card.image : null, 
				answer: (card && !game.roundActive) ? card.answer : null,
				activeUser: user,
				loggedIn: true
			});
		}
		// User is a player, the game is waiting to start
		return res.status(200).render("pages/game-wait", {game: game, activeUser: user, loggedIn: true});
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

async function chooseDeck(req, res, gamemode) {
	const officialDecks = await Deck.find({"creator": "Trivial"});
	const randomOfficial = officialDecks[Math.floor(Math.random() * officialDecks.length)];
	const unlimitedDecks = await Deck.find({});
	const randomUnlimited = unlimitedDecks[Math.floor(Math.random() * unlimitedDecks.length)];

	let deckChoiceOfficial = req.cookies.deckChoiceOfficial;
	if (!deckChoiceOfficial) deckChoiceOfficial = randomOfficial._id;

	let deckChoiceUnlimited = req.cookies.deckChoiceUnlimited;
	if (!deckChoiceUnlimited) deckChoiceUnlimited = randomUnlimited._id;

	switch (gamemode.split("/")[1]) {
		case "byod-official":
			return deckChoiceOfficial;
		case "byod-unlimited":
			return deckChoiceUnlimited;
		default:
			return null;
	}
}

async function getInfo(req, res) {
	try {
		const game = await Game.findById(req.params.id);

		if (game.hasFinished) {
			res.status(200).json({
				game: game,
				question: "This game has finished.",
				image: "/img/favicon.svg",
				answer: `Congratulations ${game.winner}! You've won the game!`
			});
		} else {
			const card = await Card.findById(game.currentCard);
			res.status(200).json({
				game: game,
				question: card ? card.question : null,
				image: card ? card.image : null,
				answer: (card && !game.roundActive) ? card.answer : null
			});
		}
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
			await startRound(game._id);
			return res.status(200).send();
		} else {
			return res.status(403).send();
		}
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

async function submitAnswer(req, res) {
	try {
		const game = await Game.findById(req.params.id);

		if (!game.hasStarted || game.hasFinished || !game.roundActive) {
			// It doesn't make sense to parse an answer right now
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

		for (const player of game.players) {
			if (user.name === player.name) {
				if (player.roundScore > 0) {
					// This player has already submitted the right answer!
					return res.status(400).send();
				}

				player.lastAnswer = req.body.answer;
				await game.save();
				if (await matchAnswer(game._id, player.lastAnswer)) {
					// TODO: Breakout into new function, dock points if the current player chose the deck
					const card = await Card.findById(game.currentCard);
					card.correct++;
					await card.save();
					const user = await User.findOne({"name": player.name});
					if (!user.cardsAnswered.includes(game.currentCard)) {
						user.cardsAnswered.push(game.currentCard);
						await user.save();
					}

					let alreadyCorrect = 0;
					for (const x of game.players) {
						if (x.roundScore > 0) {
							alreadyCorrect++;
						}
					}

					player.roundScore = Math.ceil(20 * Math.pow(alreadyCorrect + 2, -1));
					await game.save();

					if (alreadyCorrect === game.players.length - 1) {
						// Everyone has gotten the right answer now, end the round early
						clearTimeout(timeouts[game._id]);
						endRound(game._id);
					}
				}
				return res.status(200).send();
			}
		}

		// User is not a player, can't submit answers
		return res.status(403).send();
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

module.exports = { hostCustomGame, displayGame, getInfo, startGame, submitAnswer };
