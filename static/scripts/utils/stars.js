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
