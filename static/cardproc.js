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
console.log("Processing cards");
let cardContainers = document.getElementsByClassName("card-container");
for (let cardContainers of cardContainers) {
	populateContainer(cardContainers);
}


// MARK: Functions
function populateContainer(cardContainers) {
	for (let card of window.cardData) {
		let tagText = "";
		for (let tag of card.tags) {
			tagText += `<div class="card-tag">${tag}</div>`;
		}
		cardContainers.innerHTML +=
`
<div id="card-${card._id}" class="card">
	<div class="card-question">${card.name}</div>
	<img class="card-thumb" src="${card.image}"/>
	<div class="card-tags">${tagText}</div>
	<div class="fine-print">${card._id}</div>
</div>
`;
	}
}

