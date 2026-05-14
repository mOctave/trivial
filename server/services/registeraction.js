const User = require("../models/User");

async function registerAction(username) {
	await User.updateOne({"name": username}, { $set: {"dateActive": new Date()}});
}

module.exports = registerAction;