const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async function() {
	try {
		await mongoose.connect(env.databaseURI);
		console.log("MongoDB connected successfully with Mongoose.");
	} catch (e) {
		console.error(`Failed to connect to MongoDB: ${e}`);
		exit(1);
	}
}

module.exports = connectDB;
