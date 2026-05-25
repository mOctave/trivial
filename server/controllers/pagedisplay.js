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
const mongoose = require("mongoose");
const Card = require("../models/Card");
const Deck = require("../models/Deck");
const User = require("../models/User");
const authorize = require("../services/authorize");
const registerAction = require("../services/registeraction");
const Game = require("../models/Game");

async function showpage(page, req, res) {
	try {
		await authorize(req, res, false);
		res.render(page, await chooseData(page, req, res));
		if (req.user) {
			registerAction(req.user.name);
		}
	} catch (e) {
		if (e instanceof PageResolutionError) {
			res.status(404);
			res.render("errors/404");
		} else {
			res.status(500).json({error: e.message});
			res.render("errors/500");
			console.log(e);
		}
	}
}

async function chooseData(page, req, res) {
	let key;
	let target;
	switch (page) {
		case "pages/index":
			return {
				decks: await getPopularDecks(6, 0),
				leaderboard: await getLeaderboard(10, 0),
				activeUser: await (req.user ? await getUser(req.user.name) : null),
				targetUser: await (req.user ? await getUser(req.user.name) : null),
				loggedIn: await (req.user !== undefined)
			};
		case "pages/login":
			return {
				activeUser: null,
				errorLoginUsername: req.session.errorLoginUsername,
				errorLoginPassword: req.session.errorLoginPassword,
				errorRegisterUsername: req.session.errorRegisterUsername,
				errorRegisterPassword: req.session.errorRegisterPassword,
				loggedIn: await (req.user !== undefined)
			};
		case "pages/cards":
			return {
				activeUser: await (req.user ? await getUser(req.user.name) : null),
				cards: await Card.find().then((x) => {return x}),
				leaderboard: await getLeaderboard(10, 0),
				loggedIn: await (req.user !== undefined)
			}
		case "pages/user":
			key = decodeURI(req.params.target);
			target = await getUser(key);
			if (!target) throw new PageResolutionError();
			return {
				activeUser: await (req.user ? await getUser(req.user.name) : null),
				targetUser: target,
				cards: await Card.find({"creator": key}).sort({"dateCreated": "descending"}).then((x) => {return x}),
				decks: await Deck.find({"creator": key}).sort({"stars": "descending"}).then((x) => {return x}),
				leaderboard: await getLeaderboard(10, 0),
				loggedIn: await (req.user !== undefined)
			}
		case "pages/deck":
			try {
				target = await Deck.find({"_id": req.params.target}).then((x) => {return x});
			} catch (e) {
				// Errors will be caught in the next line anyways.
			}
			if (!target || target.length === 0) throw new PageResolutionError();
			return {
				activeUser: await (req.user ? await getUser(req.user.name) : null),
				decks: target,
				cards: await Card.find({"_id": {$in: target[0].cards}}).then((x) => {return x}),
				leaderboard: await getLeaderboard(10, 0),
				loggedIn: await (req.user !== undefined)
			}
		case "pages/card":
			console.log("Displaying card page!");
			try {
				target = await Card.find({"_id": req.params.target}).then((x) => {return x});
			} catch (e) {
				// Errors will be caught in the next line anyways.
			}
			if (!target || target.length === 0) throw new PageResolutionError();
			return {
				activeUser: await (req.user ? await getUser(req.user.name) : null),
				decks: await Deck.aggregate([
					{$unwind: "$cards"},
					{$match: {"cards": req.params.target}}
				]),
				cards: target,
				leaderboard: await getLeaderboard(10, 0),
				loggedIn: await (req.user !== undefined)
			}
		case "pages/play":
			return {
				activeUser: await (req.user ? await getUser(req.user.name) : null),
				targetUser: await (req.user ? await getUser(req.user.name) : null),
				leaderboard: await getLeaderboard(10, 0),
				loggedIn: await (req.user !== undefined),
				openGames: await Game.find({mode: /^custom/, hasStarted: false})
			}
		default:
			return {
				activeUser: await (req.user ? await getUser(req.user.name) : null),
				loggedIn: await (req.user !== undefined)
			}
	}
}

async function getPopularDecks(n, start) {
	let decks = await Deck.find().sort({"stars": "descending"}).lean().skip(start).limit(n).then((x) => {return x});
	return decks;
}

async function getLeaderboard(n, start) {
	let leaderboard = await User.find().sort({"rating": "descending"}).lean().skip(start).limit(n).then((x) => {return x});
	return leaderboard;
}

async function getUser(name) {
	let user = await User.findOne({"name": name}).then((x) => {return x});
	return user;
}

module.exports = showpage;

class PageResolutionError extends Error {
	constructor(message, options) {
		super(message, options);
	}
}
