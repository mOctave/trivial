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
populateTimerbar();

setInterval(() => {
	fetch(`/api/games/info/${window.gameData._id}`, {method: "GET"})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			window.gameData = data.game;
		});
	if (window.gameData.hasStarted) {
		location.reload();
	} else {
		populateLeftBar();
		populatePlayerbars();
	}
}, 250)

setInterval(() => {
	populateTimerbar();
}, 50)

// MARK: Functions
function populateLeftBar() {
	const gameDetails = document.getElementById("game-details");
	const waitCondition = document.getElementById("wait-condition");
	const startButton = document.getElementById("start-button");
	const game = window.gameData;
	gameDetails.innerHTML = 
`
<p>${game.players[0].name}'s ${game.mode}</p>
<p>Times out at ${game.timeout}</p>
<p>Players: ${game.players.length}</p>
`;

	if (game.players.length < 2) {
		waitCondition.innerHTML = `<p>Waiting for more players...</p>`;
	} else if (window.activeUserData.name === game.players[0].name) {
		waitCondition.innerHTML = `<p>You're the host! Start this game when you're ready.</p>`;
	} else {
		waitCondition.innerHTML = `<p>Waiting for the host to start the game...</p>`;
	}

	if (game.players.length >= 2 && window.activeUserData.name === game.players[0].name) {
		startButton.style.display = "block";
	} else {
		startButton.style.display = "none";
	}
}

function populateTimerbar() {
	const game = window.gameData;
	const gameTimeLeft = document.getElementById("time-left");
	gameTimeLeft.innerText = `Lobby closes in ${timeUntil(game.timeout)}`;
	const timerbar = document.getElementById("time-bar");
	timerbar.style.width = `${msUntil(game.timeout) / game.totalTimeoutLength * 100}%`;
}

function startGame() {
	fetch(`/api/games/start/${window.gameData._id}`, {method: "POST"});
}
