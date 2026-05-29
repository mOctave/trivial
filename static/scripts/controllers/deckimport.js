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

const jsonImportWidget = document.getElementById("import-deck-json");

async function importJSON() {
	if (jsonImportWidget.files[0] === undefined) return;

	const body = await new Response(jsonImportWidget.files[0]).json();

	await fetch("/api/decks/import", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
	console.log(body);
	location.reload();
}
