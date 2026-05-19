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

function timestamp(dateString) {
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

