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
		deckContainer.innerHTML +=
`
<div id="deck-${deck._id}" class="deck">
	<div class="deck-name">${deck.name}</div>
	<img class="deck-thumb" src="${deck.image}"/>
	<div class="deck-details">
		<span class="deck-stars"><img class="texticon" src="img/star-unfilled.svg" alt="star"/> ${deck.stars}</span>
		<span class="deck-creator">by ${deck.creator}</span>
	</div>
	<div class="deck-id">${deck._id}</div>
</div>
`;
	}
}

