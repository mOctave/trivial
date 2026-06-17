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

const { verifyToken } = require("./jwt");

function authorize(req, res, failHard) {
	const token = req.cookies.token;

	if (!token) {
		if (failHard) {
			console.log("[AUTH FAILURE - NO TOKEN]");
			return res.status(401).render("errors/401");
		}
		return;
	}

	try {
		req.user = verifyToken(token);
	} catch (e) {
		if (failHard) {
			console.log("[AUTH FAILURE - CANNOT VERIFY]");
			return res.status(401).render("errors/401");
		}
		return;
	}
}

module.exports = authorize;
