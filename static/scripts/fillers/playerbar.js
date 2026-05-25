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
populatePlayerbars();

// MARK: Functions
function populatePlayerbars() {
	let playerbars = document.getElementsByClassName("playerbar");
	for (let playerbar of playerbars) {
		populatePlayerbar(playerbar);
	}
}

function populatePlayerbar(playerbar) {
	playerbar.innerHTML = "";
	for (let i in window.gameData.players) {
		const player = window.gameData.players[i];
		const lastAnswer = player.lastAnswer ? player.lastAnswer : "--";
		playerbar.innerHTML += 
`
<div class="player-display content-box">
	<div class="player-score">${player.score}</div>
	<div class="player-name"><span class="player-icons"></span>${player.name}</div>
	<div class="player-answer">${lastAnswer}</div>
</div>
`;
	}
}
