const express = require("express");
const Deck = require("../models/Deck");
const User = require("../models/User");
const authorize = require("../services/authorize");
const registerAction = require("../services/registeraction");

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
	switch (page) {
		case "pages/index":
			return {
				decks: await getPopularDecks(6, 0),
				leaderboard: await getLeaderboard(10, 0),
				activeUser: await (req.user ? await getUser(req.user.name) : undefined),
				targetUser: await (req.user ? await getUser(req.user.name) : undefined),
				loggedIn: await (req.user !== undefined)
			};
		case "pages/login":
			return {
				errorLoginUsername: req.session.errorLoginUsername,
				errorLoginPassword: req.session.errorLoginPassword,
				errorRegisterUsername: req.session.errorRegisterUsername,
				errorRegisterPassword: req.session.errorRegisterPassword
			};
		case "pages/user":
			const username = decodeURI(req.params.target);
			const target = await getUser(username);
			if (!target) throw new PageResolutionError();
			return {
				activeUser: await (req.user ? await getUser(req.user.name) : undefined),
				targetUser: target,
				decks: await Deck.find({"creator": username}).then((x) => {return x}),
				leaderboard: await getLeaderboard(10, 0)
			}
		default:
			return {
				activeUser: await (req.user ? await getUser(req.user.name) : undefined),
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
