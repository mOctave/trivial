const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	decksCreated: {
		type: [String],
		required: true,
		default: []
	},
	decksStarred: {
		type: [String],
		required: true,
		default: []
	},
	dateCreated: {
		type: Date,
		required: true,
		default: () => new Date()
	},
	dateActive: {
		type: Date,
		required: true,
		default: () => new Date()
	},
	rating: {
		type: Number,
		required: true,
		default: 100
	}
});

module.exports = mongoose.model("User", UserSchema);
