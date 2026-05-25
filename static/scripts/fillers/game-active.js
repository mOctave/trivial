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

// MARK: Execute
populateLeftBar();

setInterval(() => {
	fetch(`/api/games/info/${window.gameData._id}`, {method: "GET"})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			window.gameData = data.game;
		});
	if (window.gameData.hasFinished) {
		location.reload();
	} else {
		populateLeftBar();
		populatePlayerbars();
	}
}, 2000)

// MARK: Functions
function populateLeftBar() {
	const gameDetails = document.getElementById("game-details");
	const game = window.gameData;
	gameDetails.innerHTML = 
`
<p>${game.players[0].name}'s ${game.mode}</p>
<p>Times out at ${game.timeout}</p>
<p>Players: ${game.players.length}</p>
`;
}
