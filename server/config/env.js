const { loadEnvFile } = require("node:process");

loadEnvFile("./.env");

const mainPort = process.env.MAIN_PORT ? process.env.MAIN_PORT : 8080;

const databasePort = process.env.DATABASE_PORT ? process.env.DATABASE_PORT : 27017;
const databaseName = process.env.DATABASE_NAME ? process.env.DATABASE_NAME : "net-moctave-trivial";
const databaseUser = process.env.DATABASE_USER ? process.env.DATABASE_USER : null;
const databasePassword = process.env.DATABASE_PW ? process.env.DATABASE_PW : null;
const databaseServer = process.env.DATABASE_SERVER ? process.env.DATABASE_SERVER : "127.0.0.1";
const databaseURI = databaseUser ? `mongodb://${databaseUser}:${databasePassword}@${databaseServer}/${databaseName}`
	: `mongodb://${databaseServer}/${databaseName}`;

const privateKey = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : "!!! INSECURE !!!";

module.exports = {
	mainPort: mainPort,
	databaseURI: databaseURI,
	privateKey: privateKey
}
