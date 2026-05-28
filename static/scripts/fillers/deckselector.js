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
const selectorOfficial = document.getElementById("byod-o-selector");
const selectorUnlimited = document.getElementById("byod-u-selector");

const user = window.activeUserData;

if (user) {
	for (const deck of window.deckData) {
		if (user.decksStarred.includes(deck._id)) {
			if (deck.creator === "Trivial") {
				addDeckSelectorOption(deck, selectorOfficial);
			}
			addDeckSelectorOption(deck, selectorUnlimited);
			console.log("Adding deck to selector");
		}
	}
}

loadCurrentSelections();

selectorOfficial.addEventListener(("change"), () => {
	document.cookie = `deckChoiceOfficial=${selectorOfficial.value}; path=/`;
})

selectorUnlimited.addEventListener(("change"), () => {
	document.cookie = `deckChoiceUnlimited=${selectorUnlimited.value}; path=/`;
})



// MARK: Functions
async function loadCurrentSelections() {
	let deckChoiceOffical = await cookieStore.get("deckChoiceOfficial");
	if (typeof deckChoiceOfficial === "undefined" || typeof deckChoiceOfficial === "null")
		deckChoiceOfficial = {value: ""};

	selectorOfficial.value = deckChoiceOfficial.value;

	let deckChoiceUnlimited = await cookieStore.get("deckChoiceUnlimited");
	if (typeof deckChoiceUnlimited === "undefined" || typeof deckChoiceUnlimited === "null")
		deckChoiceUnlimited = {value: ""};

	selectorUnlimited.value = deckChoiceUnlimited.value;
}

function addDeckSelectorOption(deck, selector) {
	let option = document.createElement("option");
	option.innerHTML = `${deck.name} (${deck._id.slice(-4)})`;
	option.value = deck._id;
	selector.add(option);
}
