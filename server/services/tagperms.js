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


const tagData = {
	"Geography": {
		image: "/img/geography.svg",
		perms: "curator"
	},
	"History": {
		image: "/img/history.svg",
		perms: "curator"
	},
	"Language": {
		image: "/img/language.svg",
		perms: "curator"
	},
	"Famous People": {
		image: "/img/famous-people.svg",
		perms: "curator"
	},
	"Art and Culture": {
		image: "/img/art-culture.svg",
		perms: "curator"
	},
	"Sports and Recreation": {
		image: "/img/sports-rec.svg",
		perms: "curator"
	},
	"Science and Technology": {
		image: "/img/science-tech.svg",
		perms: "curator"
	},
	"General Knowledge": {
		image: "/img/general-knowledge.svg",
		perms: "curator"
	},
	"Protected": {
		perms: "admin"
	}
}

function hasPermission(tag, user) {
	if (!user) return false;
	const perms = tagData[tag] ? (tagData[tag].perms ? tagData[tag].perms.toLowerCase() : "none") : "admin";
	return (
		perms === "none"
		|| (perms === "curator" && (user.badges.includes("Curator") || user.badges.includes("Admin")))
		|| (perms === "admin" && (user.badges.includes("Admin")))
	);
}

module.exports = hasPermission;
