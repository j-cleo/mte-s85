const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Workout name is Required"]
	},
	duration: {
		type: String,
		required: [true, "Duration is Required"]
	},
	userId: {
		type: String,
		required: [true, "UserId is Required"]
	},
	status: {
		type: String,
		default: "pending"
	},
	dateAdded: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Workout', workoutSchema);