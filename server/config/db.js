const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

const databasePort = 27017;
const databaseName = "net-moctave-trivial";
const mongoURI = `mongodb://127.0.0.1:${databasePort}/${databaseName}`;

const connectDB = async function() {
	try {
		await mongoose.connect(mongoURI);
		console.log("MongoDB connected successfully with Mongoose.");
	} catch (e) {
		console.error(`Failed to connect to MongoDB: ${e}`);
		exit(1);
	}
}

module.exports = connectDB;
