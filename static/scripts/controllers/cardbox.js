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

let selectedCards = [];

// MARK: Execute
console.log("Processing cards");
let cardContainers = document.getElementsByClassName("card-container");
for (let cardContainer of cardContainers) {
	populateContainer(cardContainer);
}


// MARK: Functions
function populateContainer(cardContainer) {
	for (let card of window.cardData) {
		let tagText = "";
		for (let tag of card.tags) {
			if (tagModifiable(tag, window.activeUserData)) {
				tagText += tagComponent(tag, card._id);
			} else {
				tagText += tagComponent(tag);
			}
		}
		if (card.image) {
			cardContainer.innerHTML +=
`
<a id="card-${card._id}" class="card" href="/card/${card._id}" onclick="return dontLinkOnButton(event)">
	<div class="card-question">
		<button id="card-selector-${card._id}" class="card-selection-button" onclick="selectCard('${card._id}')"></button>
		${card.question} 
	</div>
	<img class="card-thumb" src="${card.image}"/>
	<hr/>
	<div class="card-answer">${card.answer}</div>
	<div class="card-tags">${tagText}</div>
	<div class="card-creator">by ${card.creator}</div>
	<div class="fine-print">${card._id}</div>
</a>
`;
		} else {
			cardContainer.innerHTML +=
`
<a id="card-${card._id}" class="card" href="/card/${card._id}" onclick="return dontLinkOnButton(event)">
	<div class="card-question">
		<button id="card-selector-${card._id}" class="card-selection-button" onclick="selectCard('${card._id}')"></button>
		${card.question} 
	</div>
	<hr/>
	<div class="card-answer">${card.answer}</div>
	<div class="card-tags">${tagText}</div>
	<div class="card-creator">by ${card.creator}</div>
	<div class="fine-print">${card._id}</div>
</a>
`;
		}
	}

	if (window.cardData.length === 0) {
		cardContainer.innerHTML += 
`
<p>There's nothing here! Maybe you'd like to <a href="/cards">browse all cards</a> to find something?</p>
`;
		cardContainer.classList.add("wasteland");
	}

	for (let tile of cardContainer.children) {
		const rowHeight = 50;
		const originalHeight = tile.getBoundingClientRect().height;
		let height = -10;
		let rows = 0;
		while (height < originalHeight) {
			height += rowHeight + 10;
			rows ++;
		}
		tile.style["grid-row"] = `span ${rows}`;
		tile.style.height = `${height - 25}px`;
	}
}

function selectCard(id) {
	if (selectedCards.includes(id)) {
		selectedCards.splice(selectedCards.indexOf(id), 1);

		document.getElementById(`card-selector-${id}`).classList.remove("active-button");

		if (selectedCards.length === 0) {
			for (let menu of document.getElementsByClassName("select-hidable")) {
				menu.style.display = "none";
			}
		}
	} else {
		selectedCards.push(id);

		document.getElementById(`card-selector-${id}`).classList.add("active-button");

		if (selectedCards.length === 1) {
			for (let menu of document.getElementsByClassName("select-hidable")) {
				menu.style.display = "block";
			}
		}
	}

	for (let span of document.getElementsByClassName("card-selected-count")) {
		span.innerText = selectedCards.length + " card" + (selectedCards.length === 1 ? "" : "s");
	}

	hideDeleteCardsMenu();
}

function clearSelection() {
	for (let card of selectedCards) {
		document.getElementById(`card-selector-${card}`).classList.remove("active-button");
	}
	for (let menu of document.getElementsByClassName("select-hidable")) {
		menu.style.display = "none";
	}
	selectedCards = [];

	hideDeleteCardsMenu();
}

window.onload = () => {
	fetch("/api/decks/modifiable", {method: "GET"})
		.then((response) => {
			console.log(response);
			return response.json();
		})
		.then((data) => {
			console.log(data);
			let selector = document.getElementById("deck-selector");
		
			while (selector.options.length) selector.remove(0);
			for (let deck of data.modifiableDecks) {
				let option = document.createElement("option");
				option.innerHTML = `${deck.name} (${deck._id.slice(-4)})`;
				option.value = deck._id;
				selector.add(option);
			}
			menu.style.display = "block";
		});
		
	populateSelector("tag-selector");
}

async function addToDeck(form) {
	await fetch("/api/decks/addcards", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			deck: form.deck.value,
			cards: selectedCards
		})
	});
}

async function applyTag(form) {
	await fetch("/api/cards/batchapplytag", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			tag: form.tag.value,
			cards: selectedCards
		})
	});
}

function deleteCardsMenu() {
	const deletePull = document.getElementById("delete-cards-pull");
	const deleteMenu = document.getElementById("delete-cards-menu");
	deletePull.style.display = "none";
	deleteMenu.style.display = "block";
}

function hideDeleteCardsMenu() {
	const deletePull = document.getElementById("delete-cards-pull");
	const deleteMenu = document.getElementById("delete-cards-menu");
	deletePull.style.display = "block";
	deleteMenu.style.display = "none";
}

async function deleteCards() {
	await fetch("/api/cards/batchdelete", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			cards: selectedCards
		})
	});
	console.log("deleted");
}

async function removeTag(card, tag) {
	await fetch("/api/cards/batchremovetag", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			tag: tag,
			cards: [card]
		})
	});
}
