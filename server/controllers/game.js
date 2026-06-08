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
const showpage = require("./pagedisplay");

const timeouts = {};

async function startRound(gameId) {
	await drawCard(gameId);
	const game = await Game.findById(gameId);
	const roundLength = game.options.roundLength * 1000
	game.timeout = new Date(new Date().getTime() + roundLength);
	game.totalTimeoutLength = roundLength;
	for (const player of game.players) {
		player.lastAnswer = "--";
		player.roundScore = 0;
	}
	game.roundActive = true;
	game.gameEvents.push({time: new Date(), event: `New round! Question: ${(await Card.findById(game.currentCard)).question}`});
	await game.save();
	timeouts[gameId] = setTimeout(() => {
		endRound(gameId);
	}, roundLength);
}

async function endRound(gameId) {
	const game = await Game.findById(gameId);

	// Update scores
	for (const player of game.players) {
		player.score += player.roundScore;
	}
	// Check if someone is winning
	let maxWinningScore = game.options.targetScore;
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
	const pauseLength = game.options.pauseLength * 1000;
	game.timeout = new Date(new Date().getTime() + pauseLength);
	game.totalTimeoutLength = pauseLength;
	game.roundActive = false;
	await game.save();
	timeouts[gameId] = setTimeout(() => {
		startRound(gameId);
	}, pauseLength);
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
	game.gameEvents.push({time: new Date(), event: `${winner} won the game!`});
	game.hasFinished = true;
	game.roundActive = false;
	game.timeout = new Date();
	await game.save();
	if (game.options.style === "duel") {
		await assignRatingPoints(gameId);
	}
	for (const player of game.players) {
		await assignBadges(player);
	}
}

async function assignRatingPoints(gameId) {
	try {
		const game = await Game.findById(gameId);
		let winnerData, loserData;
		for (const player of game.players) {
			if (player.name === game.winner) {
				winnerData = player;
			} else {
				loserData = player;
			}
		}
		const winner = await User.findOne({name: winnerData.name});
		const loser = await User.findOne({name: loserData.name});

		const ratingRatio = winner.rating / loser.rating;
		const ratingDifference = winner.rating - loser.rating;

		if ((ratingRatio > 1 / 1.1 && ratingRatio < 1.1) || (ratingDifference > -30 || ratingDifference < 30)) {
			// Players were of a similar skill level.
			winnerData.ratingImpact = 3;
			loserData.ratingImpact = -3;
			game.gameEvents.push({time: new Date(), event: `${winner.name} gained 3 rating points, while ${loser.name} lost 3.`});
		} else if (ratingRatio > 1) {
			// Winner was stronger
			if (ratingRatio < 1.5 || ratingDifference < 100) {
				// Winner was slightly stronger
				winnerData.ratingImpact = 2;
				loserData.ratingImpact = -2;
				game.gameEvents.push({time: new Date(), event: `${winner.name} gained 2 rating points, while ${loser.name} lost 2.`});
			} else if (ratingRatio < 2.5 || ratingDifference < 250) {
				// Winner was significantly stronger
				winnerData.ratingImpact = 1;
				loserData.ratingImpact = -1;
				game.gameEvents.push({time: new Date(), event: `${winner.name} gained 1 rating point, while ${loser.name} lost 1.`});
			} else {
				// Winner was FAR stronger
				winnerData.ratingImpact = 1;
				loserData.ratingImpact = 0;
				game.gameEvents.push({time: new Date(), event: `${winner.name} gained 1 rating point. ${loser.name}'s rating was unaffected.`});
			}
		} else {
			// Loser was stronger
			if (ratingRatio > 1 / 1.5 || ratingDifference > -100) {
				// Loser was slightly stronger
				winnerData.ratingImpact = 4;
				loserData.ratingImpact = -4;
				game.gameEvents.push({time: new Date(), event: `${winner.name} gained 4 rating points, while ${loser.name} lost 4.`});
			} else if (ratingRatio > 1 / 2.5 || ratingDifference > -250) {
				// Winner was significantly stronger
				winnerData.ratingImpact = 5;
				loserData.ratingImpact = -5;
				game.gameEvents.push({time: new Date(), event: `${winner.name} gained 5 rating points, while ${loser.name} lost 5.`});
			} else {
				// Winner was FAR stronger
				winnerData.ratingImpact = 6;
				loserData.ratingImpact = -5;
				game.gameEvents.push({time: new Date(), event: `${winner.name} gained 6 rating points, while ${loser.name} lost 5.`});
			}
		}

		winner.rating += winnerData.ratingImpact;
		loser.rating += loserData.ratingImpact;
		await winner.save();
		await loser.save();
		await game.save();
	} catch (e) {
		console.log(e);
	}
}

async function assignBadges(playerData, gameId) {
	try {
		const game = await Game.findById(gameId);
		const user = await User.findOne({name: playerData.name});

		if (!user.badges.includes("Trivia Aficinado") && user.rating >= 180) {
			user.badges.push("Trivia Aficinado");
			game.gameEvents.push({time: new Date(), event: `${user.name} earned the "Trivia Aficinado" badge for reaching Silver I.`});
		}

		if (!user.badges.includes("Trivia Professional") && user.rating >= 300) {
			user.badges.push("Trivia Professional");
			game.gameEvents.push({time: new Date(), event: `${user.name} earned the "Trivia Professional" badge for reaching Gold I.`});
		}

		if (!user.badges.includes("Trivia Expert") && user.rating >= 450) {
			user.badges.push("Trivia Expert");
			game.gameEvents.push({time: new Date(), event: `${user.name} earned the "Trivia Expert" badge for reaching Platinum I.`});
		}

		if (!user.badges.includes("Trivia Legend") && user.rating >= 600) {
			user.badges.push("Trivia Legend");
			game.gameEvents.push({time: new Date(), event: `${user.name} earned the "Trivia Legend" badge for reaching Diamond I.`});
		}

		if (!user.badges.includes("Trivia Star") && user.rating >= 900) {
			user.badges.push("Trivia Star");
			game.gameEvents.push({time: new Date(), event: `${user.name} earned the "Trivia Star" badge for reaching Astral I.`});
		}

		if (!user.badges.includes("Trivia Master") && user.rating >= 1500) {
			user.badges.push("Trivia Master");
			game.gameEvents.push({time: new Date(), event: `${user.name} earned the "Trivia Master" badge for reaching Master rank.`});
		}

		if (!user.badges.includes("Trivia Grandmaster") && user.rating >= 2000) {
			user.badges.push("Trivia Grandmaster");
			game.gameEvents.push({time: new Date(), event: `${user.name} earned the "Trivia Grandmaster" badge for reaching Grandmaster rank.`});
		}

		if (!user.badges.includes("Underdog") && playerData.ratingImpact == 6) {
			user.badges.push("Underdog");
			game.gameEvents.push({time: new Date(), event: `${user.name} earned the "Underdog" badge for defeating a far more powerful opponent.`});
		}

		if (!user.badges.includes("Three's a Crowd") && game.winner == user.name && game.players.length >= 3) {
			user.badges.push("Three's a Crowd");
			game.gameEvents.push({time: new Date(), event: `${user.name} earned the "Three's a Crowd" badge for winning a game with at least three players.`});
		}

		if (!user.badges.includes("King of the Hill") && game.winner == user.name && game.players.length >= 10) {
			user.badges.push("King of the Hill");
			game.gameEvents.push({time: new Date(), event: `${user.name} earned the "King of the Hill" badge for winning a game with at least ten players.`});
		}

		if (!user.badges.includes("Pheidippides") && game.winner == user.name && game.options.targetScore >= 4219.5) {
			user.badges.push("Pheidippides");
			game.gameEvents.push({time: new Date(), event: `${user.name} earned the "Pheidippides" badge for winning a marathon-length game.`});
		}

		await user.save();
		await game.save();
	} catch (e) {
		console.log(e);
	}
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

	const deckType = game.options.cardChoice;
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
		const options = {
			style: "custom",
			cardChoice: req.body.cardChoice,
			roundLength: req.body.roundLength,
			pauseLength: req.body.pauseLength,
			targetScore: req.body.targetScore
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

		const params = {
			players: [{name: user.name, deck: await chooseDeck(req, res, options.cardChoice), score: 0}],
			options: options
		}

		const game = await Game.create(params);
		game.gameEvents.push({time: new Date(), event: `Lobby opened`});
		await game.save();
		console.log(`Created new game with options ${options}`);
		return res.status(201).redirect(`/play/${game._id}`);
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

async function displayGame(req, res) {
	try {
		const game = await Game.findById(req.params.id);

		if (!game) {
			return res.status(404).render("errors/404");
		}

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
			} else if (game.options.style === "duel" && game.players.length >= 2) {
				// Duel is full and about to start
				return res.status(403).render("errors/403");
			} else {
				// User can join the game!

				// TODO: Check if the user is already in a game - enforce one user one game limit
				game.players.push({name: user.name, deck: await chooseDeck(req, res, game.options.cardChoice), score: 0});

				game.gameEvents.push({time: new Date(), event: `${user.name} joined the game`});
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

async function chooseDeck(req, res, cardChoice) {
	const officialDecks = await Deck.find({"creator": "Trivial"});
	const randomOfficial = officialDecks[Math.floor(Math.random() * officialDecks.length)];
	const unlimitedDecks = await Deck.find({});
	const randomUnlimited = unlimitedDecks[Math.floor(Math.random() * unlimitedDecks.length)];

	let deckChoiceOfficial = req.cookies.deckChoiceOfficial;
	if (!deckChoiceOfficial) deckChoiceOfficial = randomOfficial._id;

	let deckChoiceUnlimited = req.cookies.deckChoiceUnlimited;
	if (!deckChoiceUnlimited) deckChoiceUnlimited = randomUnlimited._id;

	switch (cardChoice) {
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

		if (!game) {
			return res.status(404).json({closed: true}).send();
		}

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

			if (!game.hasStarted && game.options.style === "duel" && game.players.length >= 2) {
				await startGame(req, res);
			}
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
			game.gameEvents.push({time: new Date(), event: `Game started!`});
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

					game.gameEvents.push({time: new Date(), event: `${player.name} scored ${player.roundScore} for "${player.lastAnswer}"`});
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

async function joinDuel(req, res) {
	try {
		await authorize(req, res, true);

		if (req.user == null) {
			return;
		}

		const user = await User.findOne({"name": req.user.name});

		if (!user) {
			return res.status(401).send();
		}

		registerAction(user.name);

		let game = (req.params.type === "quick-play")
			? await Game.findOne({"options.style": "duel", hasStarted: false})
			: await Game.findOne({"options.style": "duel", "options.cardChoice": req.params.type, hasStarted: false});

		if (!game) {
			// No valid game exists yet, make one
			const options = {
				style: "duel",
				cardChoice: req.params.type === "quick-play" ? "ama" : req.params.type,
				roundLength: 15,
				pauseLength: 5,
				targetScore: 100
			}

			const params = {
				players: [{name: user.name, deck: await chooseDeck(req, res, options.cardChoice), score: 0}],
				options: options
			}

			game = await Game.create(params);
			game.gameEvents.push({time: new Date(), event: `Lobby opened`});
			await game.save();
			console.log(`Created new game with options ${options}`);
		}

		// Pass on the link to the game
		return res.status(200).json({id: game._id});
	} catch (e) {
		res.status(500).send();
		console.log(e);
	}
}

module.exports = { hostCustomGame, displayGame, getInfo, startGame, submitAnswer, joinDuel };
