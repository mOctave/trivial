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
let joinMenus = document.getElementsByClassName("joinmenu");
for (let joinMenu of joinMenus) {
	populateJoinMenu(joinMenu);
}

// MARK: Functions
function populateJoinMenu(joinMenu) {
	let empty = true;
	for (const game of window.openGameData) {
		if (game.options.style === "custom") {
			joinMenu.innerHTML +=
`
<div>
	<span class="lobby-count">${game.players.length}</span>
	${game.players[0].name}'s ${game.options.style} / ${game.options.cardChoice}
	<a class="button-highlighted" href="/play/${game._id}">Join</a>
</div>
`;
			empty = false;
		}
	}
	if (empty) {
		joinMenu.innerHTML += 
`
<p style="text-align:center;font-style:italic;">There's nothing here! Looks like it's up to you to host a new game.</p>
`;
	}
}
