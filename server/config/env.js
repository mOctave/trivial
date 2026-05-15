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

const jwtSecret = process.env.JWT_SECRET ? process.env.JWT_SECRET : "!!! INSECURE !!!";
const sessionSecret = process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "!!! INSECURE !!!";

const superuserPassword = process.env.SUPERUSER_PASSWORD ? process.env.SUPERUSER_PASSWORD : "admin";

module.exports = { mainPort, databaseURI, jwtSecret, sessionSecret, superuserPassword }
