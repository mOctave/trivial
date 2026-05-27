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
populateCentre();

setInterval(() => {
	fetch(`/api/games/info/${window.gameData._id}`, {method: "GET"})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			window.gameData = data.game;
			window.questionData = data.question;
			window.answerData = data.answer;
		});
	if (window.gameData.hasFinished) {
		location.reload();
	} else {
		populateLeftBar();
		populateCentre();
		populatePlayerbars();
	}
}, 250);

setInterval(() => {
	populateTimerbar();
}, 50)

// MARK: Functions
function populateLeftBar() {
	const gameDetails = document.getElementById("game-details");
	const game = window.gameData;
	gameDetails.innerHTML = 
`
<p>${game.players[0].name}'s ${game.mode}</p>
<p>Players: ${game.players.length}</p>
`;
}

function populateTimerbar() {
	const game = window.gameData;
	const gameTimeLeft = document.getElementById("time-left");
	if (game.currentCard) {
		gameTimeLeft.innerText = `${timeUntil(game.timeout)} remaining`;
	} else {
		gameTimeLeft.innerText = `Next round in ${timeUntil(game.timeout)}`;
	}
	const timerbar = document.getElementById("time-bar");
	timerbar.style.width = `${msUntil(game.timeout) / game.totalTimeoutLength * 100}%`;
}

function populateCentre() {
	const gameQuestion = document.getElementById("card-question");
	const gameImage = document.getElementById("card-image");
	const gameAnswer = document.getElementById("card-answer");

	if (window.questionData) {
		gameQuestion.innerText = window.questionData;
	}

	if (window.imageData) {
		gameImage.innerHTML = `<img src="${window.imageData}"/>`
	}

	if (window.answerData) {
		gameAnswer.innerText = window.answerData;
	}
}

async function sendAnswer(id) {
	await fetch(`/api/games/answer/${id}`, {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			answer: document.getElementById("answer-bar").value
		})
	});
}
