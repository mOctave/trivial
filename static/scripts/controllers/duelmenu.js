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
populateLobbyCounters();

// MARK: Functions
function populateLobbyCounters() {
	console.log("Populating lobby counters");
	const games = window.openGameData;
	const validGames = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (const game of window.openGameData) {
		console.log(`Marking game with options ${JSON.stringify(game.options)}`);
		if (game.options.style === "duel") {
			validGames[0]++;
			switch (game.options.cardChoice) {
				case "geography": validGames[1]++; break;
				case "history": validGames[2]++; break;
				case "language": validGames[3]++; break;
				case "famous-people": validGames[4]++; break;
				case "ama": validGames[5]++; break;
				case "art-culture": validGames[6]++; break;
				case "sports-rec": validGames[7]++; break;
				case "science-tech": validGames[8]++; break;
				case "general-knowledge": validGames[9]++; break;
				case "byod-official": validGames[10]++; break;
				case "byod-unlimited": validGames[11]++; break;
				default: console.error("Unaccounted-for card choice for duel game");
			}
			for (let i = 0; i < 12; i++) {
				document.getElementById(`lc-${i}`).innerText = validGames[i];
			}
		}
	}
}


async function joinDuel(type) {
	await fetch(`/api/games/duel/${type}`, {method: "GET"})
		.then((response) => {
			console.log(response);
			return response.json();
		})
		.then((data) => {
			window.location = `/play/${data.id}`;
		});
}
