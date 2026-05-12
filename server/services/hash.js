const bcrypt = require("bcrypt");

async function hash(plain) {
	return await bcrypt.hash(plain, 10);
}

async function compare(plain, hashed) {
	return await bcrypt.compare(plain, hashed);
}

module.exports = { hash, compare }
