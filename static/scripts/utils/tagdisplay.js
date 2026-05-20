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

const tagImages = {
	"Geography": "/img/geography.svg",
	"History": "/img/history.svg",
	"Language": "/img/language.svg",
	"Famous People": "/img/famous-people.svg",
	"Art and Culture": "/img/art-culture.svg",
	"Sports and Recreation": "/img/sports-rec.svg",
	"Science and Technology": "/img/science-tech.svg",
	"General Knowledge": "/img/general-knowledge.svg"
}

function tagImage(tag) {
	return tagImages[tag];
}

function tagComponent(tag, removeId) {
	const img = tagImage(tag);
	const imageString = img ? `<img src="${img}"/>` : "";
	const removableString = removeId ? `<button onclick="removeTag('${removeId}', '${tag}')">x</button>` : "";
	return `<div class="card-tag">${removableString}${imageString}${tag}</div>`;
}
