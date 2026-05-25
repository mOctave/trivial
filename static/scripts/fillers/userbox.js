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
	populateUserbox(userContainer);
}

// MARK: Functions
function populateUserbox(userContainer) {
	let user = window.targetUserData;
	userContainer.innerHTML +=
`
<h2 class="user-name">${user.name}</h2>
<img class="pfp" src="${user.pfp}" alt="${user.name}'s profile picture"/>
<div class="user-rating">${user.rating} <span style="float: right;">${describeUserRating(user.rating)}</span></div>
<div class="user-join-date">Joined ${timestamp(user.dateCreated)}</div>
<div class="user-activity">Last active ${timestamp(user.dateActive)}</div>
<div class="fine-print">${user._id}</div>
`;
}

function describeUserRating(raw) {
	if (raw < 60) return `<span class="rank-iron">Iron</span>`;
	if (raw < 120) return `<span class="rank-bronze">Bronze I</span>`;
	if (raw < 150) return `<span class="rank-bronze">Bronze II</span>`;
	if (raw < 180) return `<span class="rank-bronze">Bronze III</span>`;
	if (raw < 220) return `<span class="rank-silver">Silver I</span>`;
	if (raw < 260) return `<span class="rank-silver">Silver II</span>`;
	if (raw < 300) return `<span class="rank-silver">Silver III</span>`;
	if (raw < 350) return `<span class="rank-gold">Gold I</span>`;
	if (raw < 400) return `<span class="rank-gold">Gold II</span>`;
	if (raw < 450) return `<span class="rank-gold">Gold III</span>`;
	if (raw < 500) return `<span class="rank-platinum">Platinum I</span>`;
	if (raw < 550) return `<span class="rank-platinum">Platinum II</span>`;
	if (raw < 600) return `<span class="rank-platinum">Platinum III</span>`;
	if (raw < 700) return `<span class="rank-diamond">Diamond I</span>`;
	if (raw < 800) return `<span class="rank-diamond">Diamond II</span>`;
	if (raw < 900) return `<span class="rank-diamond">Diamond III</span>`;
	if (raw < 1100) return `<span class="rank-astral">Astral I</span>`;
	if (raw < 1300) return `<span class="rank-astral">Astral II</span>`;
	if (raw < 1500) return `<span class="rank-astral">Astral III</span>`;
	if (raw < 2000) return `<span class="rank-master">Master</span>`;
	return `<span class="rank-gm">Grandmaster</span>`;
}
