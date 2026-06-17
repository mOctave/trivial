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

const express = require("express");
const bodyParser = require("body-parser");
const erl = require("express-rate-limit");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const env = require("./config/env");
const setSuperuser = require("./config/setsuperuser");
const { purgeAllOpenGames, purgeTimedOutLobbies } = require("./services/purge");

const limiter = erl.rateLimit({
	windowMs: 30 * 1000,
	limit: 500,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	ipv6Subnet: 60,
	handler: (req, res, next, options) => res.render("errors/429")
});

const app = express();
initDatabase();

app.set("view engine", "ejs");
app.set("trust proxy", "127.0.0.1");
app.use(express.json());
app.use(express.static("static"));
app.use(limiter);
app.use(session({secret: env.sessionSecret, resave: false, saveUninitialized: false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/cards", require("./routes/card"));
app.use("/api/decks", require("./routes/deck"));
app.use("/api/games", require("./routes/game"));
app.use("/api/users", require("./routes/user"));

app.use("", require("./routes/pages"));

purgeAllOpenGames();
setInterval(purgeTimedOutLobbies, 10000);

app.listen(env.mainPort, () => console.log(`Server listening on port ${env.mainPort}`));

// MARK: Functions
async function initDatabase() {
	await connectDB();
	setSuperuser();
}
