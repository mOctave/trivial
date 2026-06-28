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

const User = require("../models/User");
const { hash, compare } = require("../services/hash");
const { generateToken } = require("../services/jwt");
const registerAction = require("../services/registeraction");

const errorUserAlreadyExists = "The username you selected is already in use. Please choose a different name.";
const errorBlankUsername = "Please choose a username that isn't just whitespace.";
const errorLongUsername = "Sorry, the maximum username length is 32 characters. Please use a shorter name.";
const errorShortPassword = "Your password is too short. Please use a password with at least 8 characters.";
const errorLongPassword = "Sorry, the maximum password length is 256 characters. Please use a shorter password.";
const errorInvalidUsernameOrPassword = "The username or password you entered is invalid.";
const errorInternal = `An unforseen error occured. If this problem persists, please report it <a href="https://github.com/moctave/trivial/issues">on GitHub</a> to help us debug it.`;

async function register(req, res) {
	try {
		clearSessionErrors(req);
		if (req.body.name === "") {
			res.status(400);
			req.session.errorRegisterUsername = errorBlankUsername;
			return res.redirect("/login");
		}

		if (req.body.name.length > 32) {
			res.status(400);
			req.session.errorRegisterUsername = errorLongUsername;
			return res.redirect("/login");
		}

		if (req.body.password.length < 8) {
			res.status(400);
			req.session.errorRegisterPassword = errorShortPassword;
			return res.redirect("/login");
		}

		if (req.body.password.length > 256) {
			res.status(400);
			req.session.errorRegisterPassword = errorLongPassword;
			return res.redirect("/login");
		}

		if (await User.findOne({name: req.body.name})) {
			res.status(400);
			req.session.errorRegisterUsername = errorUserAlreadyExists;
			return res.redirect("/login");
		}

		const hashedPassword = await hash(req.body.password);
		const userData = {
			name: req.body.name,
			password: hashedPassword
		}

		const user = await User.create(userData);

		const token = generateToken({id: user._id, name: user.name});
		res.cookie("token", token, {httpOnly: true, sameSite: "strict"});

		res.status(201);
		console.log(`Created user "${req.body.name}".`);

		res.redirect("/");
	} catch (e) {
		res.status(500);
		req.session.errorRegisterPassword = errorInternal;
		console.log(e);
		return res.redirect("/login");
	}
}

async function login(req, res) {
	try {
		clearSessionErrors(req);
		if (req.body.name === "") {
			res.status(400);
			req.session.errorLoginUsername = errorBlankUsername;
			return res.redirect("/login");
		}

		if (req.body.name.length > 32) {
			res.status(400);
			req.session.errorLoginUsername = errorLongUsername;
			return res.redirect("/login");
		}

		if (req.body.password.length < 8) {
			res.status(400);
			req.session.errorLoginPassword = errorShortPassword;
			return res.redirect("/login");
		}

		if (req.body.password.length > 256) {
			res.status(400);
			req.session.errorLoginPassword = errorLongPassword;
			return res.redirect("/login");
		}

		const user = await User.findOne({name: req.body.name}).select("+password");

		if (!user) {
			res.status(400);
			req.session.errorLoginPassword = errorInvalidUsernameOrPassword;
			return res.redirect("/login");
		}

		if (!await compare(req.body.password, user.password)) {
			res.status(400);
			req.session.errorLoginPassword = errorInvalidUsernameOrPassword;
			return res.redirect("/login");
		}

		const token = generateToken({id: user._id, name: user.name});
		res.cookie("token", token, {httpOnly: true, sameSite: "strict"});

		registerAction(user.name);
		res.status(200);
		res.redirect("/");
	} catch (e) {
		res.status(500);
		req.session.errorLoginPassword = errorInternal;
		console.log(e);
		return res.redirect("/login");
	}
}

async function logout(req, res) {
	res.clearCookie("token");
	return res.status(200).redirect("/");
}

function clearSessionErrors(req) {
	req.session.errorLoginUsername = undefined;
	req.session.errorLoginPassword = undefined;
	req.session.errorRegisterUsername = undefined;
	req.session.errorRegisterPassword = undefined;
}

module.exports = { register, login, logout }
