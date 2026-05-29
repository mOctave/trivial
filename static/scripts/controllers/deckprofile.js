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
let mode = "VIEW";

populateProfile();
configureView();

// MARK: Methods
function populateProfile() {
	let deck = window.deckData[0];
	let starButtonClasses = "deck-star-toggle";
	if (window.activeUserData != null) {
		if (window.activeUserData.decksStarred.includes(deck._id)) {
			starButtonClasses += " active-button";
		}
	}

	document.getElementById("deck-profile").innerHTML =
`
	<div class="deck-name">${deck.name}</div>
	<img class="deck-thumb" src="${deck.image}"/>
	<div class="deck-description">${deck.description}</div>
	<div class="deck-details">
		<span class="deck-stars"><button id="deck-star-toggle-${deck._id}" class="${starButtonClasses}" onclick="toggleStar('${deck._id}')"></button> <span id="deck-star-count-${deck._id}">${deck.stars}</span></span>
		<span class="deck-cards"><span class="icon-card"></span><span id="deck-card-count-${deck._id}">${deck.cards.length}</span></span>
		<span class="deck-creator">by ${deck.creator}</span>
	</div>
	<div class="fine-print">${deck._id}</div>
`;

	document.getElementById("deck-editor-body").innerHTML = 
`
	<div class="deck-name">
		<label for="name">Deck&nbsp;name:</label>
		<input name="name" type="text" placeholder="${deck.name}" value="${deck.name}" required/>
	</div>
	<img class="deck-thumb" src="${deck.image}"/>
	<div class="deck-description">
		<label for="description">Deck&nbsp;description:</label>
		<textarea name="description" placeholder="Enter a short description of your deck." rows="4">${deck.description}</textarea>
	</div>
	<div class="deck-details">
		<span class="deck-stars"><button id="deck-star-toggle-${deck._id}" class="${starButtonClasses}" onclick="toggleStar('${deck._id}')"></button> <span id="deck-star-count-${deck._id}">${deck.stars}</span></span>
		<span class="deck-cards"><span class="icon-card"></span><span id="deck-card-count-${deck._id}">${deck.cards.length}</span></span>
		<span class="deck-creator">by ${deck.creator}</span>
	</div>
	<div class="fine-print">${deck._id}</div>
`;
}

function configureView() {
	let activeUser = window.activeUserData;
	let deck = window.deckData[0];
	let canEdit = activeUser &&((activeUser.name === deck.creator) || (activeUser.badges.includes("Admin")));

	if (!canEdit) {
		document.getElementById("deck-profile").style.display = "block";
		document.getElementById("deck-editor").style.display = "none";
		document.getElementById("edit-button").style.display = "none";
		document.getElementById("delete-button").style.display = "none";
		document.getElementById("delete-confirmation").style.display = "none";
	} else if (mode === "EDIT") {
		document.getElementById("deck-profile").style.display = "none";
		document.getElementById("deck-editor").style.display = "block";
		document.getElementById("edit-button").style.display = "none";
		document.getElementById("delete-button").style.display = "none";
		document.getElementById("delete-confirmation").style.display = "none";
	} else {
		document.getElementById("deck-profile").style.display = "block";
		document.getElementById("deck-editor").style.display = "none";
		document.getElementById("edit-button").style.display = "block";
		document.getElementById("delete-button").style.display = "block";
		document.getElementById("delete-confirmation").style.display = "none";
	}
}

function editDeck() {
	mode = "EDIT";
	configureView();
}

function uneditDeck() {
	mode = "VIEW";
	configureView();
	populateProfile();
}

function promptDeleteDeck() {
	document.getElementById("delete-confirmation").style.display = "block";
}

async function confirmDeleteDeck() {
	// TODO: Don't delete decks that are currently in use
	console.log("Deleting");
	fetch(`/api/decks/delete/${window.deckData[0]._id}`, {method: "POST", redirect: "manual"})
		.then(response => {
			console.log("Redirecting");
			window.location.href = "/";
			return;
		});
}
