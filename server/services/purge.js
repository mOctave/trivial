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

const Game = require("../models/Game");

// Purge all games that are in-progress or waiting to start.
// This function should run when the server reboots.
async function purgeAllOpenGames() {
	const result = await Game.deleteMany({hasFinished: false});
	console.log(`Purged ${result.deletedCount} open games`);
}

// Purge all games whose lobbies have timed out.
async function purgeTimedOutLobbies() {
	const result = await Game.deleteMany({hasStarted: false, timeout: {"$lt": new Date()}});
	console.log(`Purged ${result.deletedCount} timed-out lobbies`);
}

module.exports = { purgeAllOpenGames, purgeTimedOutLobbies };
