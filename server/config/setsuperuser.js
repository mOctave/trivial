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
const env = require("./env");
const { hash } = require("../services/hash");

async function setSuperuser() {
	console.log("Setting superuser");
	let query = {"name": "Trivial"};
	let update = {
		"name": "Trivial",
		"password": await hash(env.superuserPassword),
		"pfp": "/img/admin.svg",
		"badges": ["Trivialist", "Admin"]
	}
	let options = {upsert: true, new: true, setDefaultsOnInsert: true}
	console.log(`Superuser set: ${(await User.findOneAndUpdate(query, update, options)).name}`);
}

module.exports = setSuperuser;
