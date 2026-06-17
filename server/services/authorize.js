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
const { verifyToken } = require("./jwt");

// Returns:
// false - if there is no token, the token doesn't properly verify, or there is no matching user
// true - if there is a matching user
async function authorize(req, res) {
	const token = req.cookies.token;

	if (!token) {
		return false;
	}

	try {
		req.user = verifyToken(token);
	} catch (e) {
		return false;
	}

	const user = await User.findOne({"name": req.user.name});
	return user !== null;
}

module.exports = authorize;
