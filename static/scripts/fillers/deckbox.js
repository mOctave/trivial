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
console.log("Processing decks");
let deckContainers = document.getElementsByClassName("deck-container");
for (let deckContainer of deckContainers) {
	populateContainer(deckContainer);
}


// MARK: Functions
function populateContainer(deckContainer) {
	for (let deck of window.deckData) {
		let starButtonClasses = "deck-star-toggle";
		if (window.activeUserData != null) {
			if (window.activeUserData.decksStarred.includes(deck._id)) {
				starButtonClasses += " active-button";
			}
		}

		deckContainer.innerHTML +=
`
<a id="deck-${deck._id}" class="deck" href="/deck/${deck._id}" onclick="return dontLinkOnButton(event)">
	<div class="deck-name">${deck.name}</div>
	<img class="deck-thumb" src="${deck.image}"/>
	<div class="deck-details">
		<span class="deck-stars"><button id="deck-star-toggle-${deck._id}" class="${starButtonClasses}" onclick="toggleStar('${deck._id}')"></button> <span id="deck-star-count-${deck._id}">${deck.stars}</span></span>
		<span class="deck-creator">by ${deck.creator}</span>
	</div>
	<div class="fine-print">${deck._id}</div>
</a>
`;
	}
}

function dontLinkOnButton(e) {
	if (e.target instanceof HTMLElement && e.target.tagName === "BUTTON") {
	 	e.preventDefault();
	}
}

function toggleStar(deck) {
	if (window.activeUserData != null) {
		let toggle = document.getElementById(`deck-star-toggle-${deck}`);
		let count = document.getElementById(`deck-star-count-${deck}`);
		if (window.activeUserData.decksStarred.includes(deck)) {
			toggle.classList.remove("active-button");
			count.innerText = Number(count.innerText) - 1;
			window.activeUserData.decksStarred.splice(window.activeUserData.decksStarred.indexOf(deck), 1);
			// Send to server
			fetch(`/api/decks/unstar/${deck}`, {method: "POST"}).catch((e) => {console.log(e)});
		} else {
			toggle.classList.add("active-button");
			count.innerText = Number(count.innerText) + 1;
			window.activeUserData.decksStarred.push(deck);
			// Send to server
			fetch(`/api/decks/star/${deck}`, {method: "POST"}).catch((e) => {console.log(e)});
		}
	}
}
