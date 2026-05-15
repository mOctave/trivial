const express = require("express");
const bodyParser = require("body-parser");
const erl = require("express-rate-limit");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const env = require("./config/env");
const setSuperuser = require("./config/setsuperuser");

const limiter = erl.rateLimit({
	windowMs: 30 * 1000,
	limit: 50,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	ipv6Subnet: 60,
	handler: (req, res, next, options) => res.render("errors/429")
});

const app = express();
connectDB();

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("static"));
app.use(limiter);
app.use(session({secret: env.sessionSecret, resave: false, saveUninitialized: false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("", require("./routes/pages"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cards", require("./routes/card"));
app.use("/api/decks", require("./routes/deck"));
app.use("/api/users", require("./routes/user"));

app.listen(env.mainPort, () => console.log(`Server listening on port ${env.mainPort}`));

setSuperuser();
