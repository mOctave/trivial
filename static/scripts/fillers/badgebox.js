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

// MARK: Constants
const badgeData = {
	"Trivialist": {
		image: "/img/trivialist.svg",
		condition: "Earn this badge by reaching Bronze I."
	},
	"Trivia Aficinado": {
		image: "/img/trivia-aficinado.svg",
		condition: "Earn this badge by reaching Silver I."
	},
	"Trivia Professional": {
		image: "/img/trivia-professional.svg",
		condition: "Earn this badge by reaching Gold I."
	},
	"Trivia Expert": {
		image: "/img/trivia-expert.svg",
		condition: "Earn this badge by reaching Platinum I."
	},
	"Trivia Legend": {
		image: "/img/trivia-legend.svg",
		condition: "Earn this badge by reaching Diamond I."
	},
	"Trivia Star": {
		image: "/img/trivia-star.svg",
		condition: "Earn this badge by reaching Astral I."
	},
	"Trivia Master": {
		image: "/img/trivia-master.svg",
		condition: "Earn this badge by reaching Master."
	},
	"Trivia Grandmaster": {
		image: "/img/trivia-grandmaster.svg",
		condition: "Earn this badge by reaching Grandmaster."
	},
	"Admin": {
		image: "/img/admin.svg",
		condition: "This badge cannot be earned, only bestowed upon the worthy. It grants access to the deepest levels of control imagineable."
	},
	"Tinker": {
		image: "/img/card-filled.svg",
		condition: "Earn this badge by creating a card."
	},
	"Apprentice": {
		image: "/img/deck-filled.svg",
		condition: "Earn this badge by creating five cards."
	},
	"Starstruck": {
		image: "/img/star-filled.svg",
		condition: "Earn this badge by receiving ten stars on decks you create."
	},
}


// MARK: Execute
let badgeContainers = document.getElementsByClassName("badge-container");
for (let badgeContainer of badgeContainers) {
	populateContainer(badgeContainer);
}

// MARK: Functions
function populateContainer(badgeContainer) {
	let user = window.targetUserData;
	for (let badge of user.badges) {
		console.log(badge);
		badgeContainer.innerHTML +=
`
<div class="badge" hovertext="${badgeData[badge].condition}">
	<img class="badge-icon" src="${badgeData[badge].image}"/>
	<div class="badge-caption">${badge}</div>
</div>
`;
	}
}

