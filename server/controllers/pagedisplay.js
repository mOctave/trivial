const express = require("express");
const Deck = require("../models/Deck");
const User = require("../models/User");
const authorize = require("../services/authorize");

async function showpage(page, req, res) {
	try {
		res.render(page, await chooseData(page, req, res));
	} catch (e) {
		res.status(500).json({error: e.message});
		res.render("errors/500");
		console.log(e);
	}
}

async function chooseData(page, req, res) {
	switch (page) {
		case "pages/index":
			await authorize(req, res, false);
			return {
				decks: await getPopularDecks(6, 0),
				leaderboard: await getLeaderboard(10, 0),
				user: await (req.user ? await getUser(req.user.name) : undefined),
				loggedIn: await (req.user !== undefined)
			};
		case "pages/login":
			return {
				errorLoginUsername: req.session.errorLoginUsername,
				errorLoginPassword: req.session.errorLoginPassword,
				errorRegisterUsername: req.session.errorRegisterUsername,
				errorRegisterPassword: req.session.errorRegisterPassword
			};
		default:
			return {
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
