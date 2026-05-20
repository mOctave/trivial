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
		<span class="deck-cards"><span class="icon-card"></span><span id="deck-card-count-${deck._id}">${deck.cards.length}</span></span>
		<span class="deck-creator">by ${deck.creator}</span>
	</div>
	<div class="fine-print">${deck._id}</div>
</a>
`;
	}
}
