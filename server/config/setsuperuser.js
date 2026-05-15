const User = require("../models/User");
const env = require("./env");
const { hash } = require("../services/hash");

async function setSuperuser() {
	console.log("Setting superuser");
	let query = {"name": "Trivial"};
	let update = {
		"name": "Trivial",
		"password": await hash(env.superuserPassword),
		"pfp": "/img/admin.svg",
		"badges": ["Trivialist", "Admin"]
	}
	let options = {upsert: true, new: true, setDefaultsOnInsert: true}
	console.log(`Superuser set: ${(await User.findOneAndUpdate(query, update, options)).name}`);
}

module.exports = setSuperuser;
