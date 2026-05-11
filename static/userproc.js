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
let userContainers = document.getElementsByClassName("user-container");
for (let userContainer of userContainers) {
	populateContainer(userContainer);
}

// MARK: Functions
function populateContainer(userContainer) {
	let user = window.userData;
	userContainer.innerHTML +=
`
<h2 class="user-name">${user.name}</h2>
<img class="pfp" src="${user.pfp}" alt="${user.name}'s profile picture"/>
<div class="user-rating">${user.rating} <span style="float: right;">${describeUserRating(user.rating)}</span></div>
<div class="user-join-date">Joined ${describeDate(user.dateCreated)}</div>
<div class="user-activity">Last active ${describeDate(user.dateActive)}</div>
<div class="fine-print">${user._id}</div>
`;
}

function describeUserRating(raw) {
	if (raw < 60) return "Iron";
	if (raw < 120) return "Bronze I";
	if (raw < 150) return "Bronze II";
	if (raw < 180) return "Bronze III";
	if (raw < 220) return "Silver I";
	if (raw < 260) return "Silver II";
	if (raw < 300) return "Silver III";
	if (raw < 350) return "Gold I";
	if (raw < 400) return "Gold II";
	if (raw < 450) return "Gold III";
	if (raw < 500) return "Platinum I";
	if (raw < 550) return "Platinum II";
	if (raw < 600) return "Platinum III";
	if (raw < 700) return "Diamond I";
	if (raw < 800) return "Diamond II";
	if (raw < 900) return "Diamond III";
	if (raw < 1100) return "Astral I";
	if (raw < 1300) return "Astral II";
	if (raw < 1500) return "Astral III";
	if (raw < 2000) return "Master";
	return "Grandmaster";
}


function describeDate(dateString) {
	const date = new Date(dateString);
	console.log(`Describing date ${date}`);
	const diffTime = (new Date() - date) / 1000;
	
	if (diffTime < 0) return "in the future";
	if (diffTime < 60) return "less than a minute ago";
	if (diffTime < 60 * 60) return `${Math.floor(diffTime / 60)} minutes ago`;
	if (diffTime < 60 * 60 * 24) return `${Math.floor(diffTime / 60 / 60)} hours ago`;
	if (diffTime < 60 * 60 * 24 * 7) return `${Math.floor(diffTime / 60 / 60 / 24)} days ago`;

	return Intl.DateTimeFormat(navigator.language, {month: "long", year: "numeric", day: "numeric"}).format(date);
}
