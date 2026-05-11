const express = require("express");
const Deck = require("../models/Deck");
const User = require("../models/User");

async function showpage(page, res) {
	try {
		res.render(page, await chooseData(page));
	} catch (e) {
		res.status(500).json({error: e.message});
		res.render("errors/500");
		console.log(e);
	}
}

async function chooseData(page) {
	switch (page) {
		case "pages/index":
			return {
				decks: await getPopularDecks(6, 0),
				leaderboard: await getLeaderboard(5, 0)
			};
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

module.exports = showpage;
