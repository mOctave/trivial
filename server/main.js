const express = require("express");
const erl = require("express-rate-limit");
const connectDB = require("./config/db");

const MAIN_PORT = 41850;

const limiter = erl.rateLimit({
	windowMs: 30 * 1000,
	limit: 25,
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

app.use("", require("./routes/pages"));
app.use("/api/cards", require("./routes/card"));
app.use("/api/decks", require("./routes/deck"));
app.use("/api/users", require("./routes/user"));

app.listen(MAIN_PORT, () => console.log(`Server listening on port ${MAIN_PORT}`));
