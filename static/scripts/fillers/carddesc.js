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
let cardDescriptionContainers = document.getElementsByClassName("card-desc-container");
for (let cardDescriptionContainer of cardDescriptionContainers) {
	populateContainer(cardDescriptionContainer);
}

// MARK: Functions
function populateContainer(cardDescriptionContainer) {
	let card = window.cardData[0];
	cardDescriptionContainer.innerHTML +=
`
<p>This card was created ${timestamp(card.dateCreated)} by ${card.creator} and was last modified ${timestamp(card.dateModified)}. It has been correctly answered ${card.correct} times out of the ${card.presentations} times it has been shown.</p>
`;
}
