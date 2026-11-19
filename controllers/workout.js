const User = require("../models/User");
const Workout = require("../models/Workout");
const { errorHandler } = require("../auth.js");

module.exports.addWorkout = (req, res) => {
	const { name, duration, userId } = req.body;

	return User.findOne({ userId: userId })
	.then(user => {
		if(req.user.id !== userId) {
			return res.status(403).send({ error: "Id must match with your account"});
		}
		const newWorkout = new Workout({
			name: name,
			duration: duration,
			userId: userId
		});

		return newWorkout.save()
		.then(savedWorkout => res.status(201).send(savedWorkout));
	})
	.catch(error => {
		console.log(error);
		return res.status(500).send({ error: "Unable to add workout!"});
	});
}

module.exports.getWorkouts = (req, res) => {
	const userId = req.user.id;

	return Workout.find({ userId: userId })
	.then(workout => {
		if (!workout) {
			return res.status(400).send({
				message: "Workouts not found"
			});
		}

		return res.status(200).send({
			workouts: workout
		});
	})
	.catch(error => {
		console.log(error);
		return res.status(500).send({ error: "Unable to fetch workouts!"});
	});
}

module.exports.updateWorkout = (req, res) => {
	const { name, newName, newDuration } = req.body;
	let workoutUpdate = {
		name: newName,
		duration: newDuration
	}

	return Workout.findOneAndUpdate({ name: name }, workoutUpdate)
	.then(workout => {
		if(workout) {
			return res.status(200).send({ message: "Workout updated!" });
		} else {
			return res.status(400).send({ error: "Workout not found!" });
		}
	})
	.catch(error => {
		console.log(error);
		return res.status(500).send({ error: "Unable to update workout!"});
	});
}

module.exports.deleteWorkout = (req, res) => {
	const { name } = req.body;

	return Workout.findOneAndDelete({ name: name })
	.then(workout => {
		if(workout) {
			return res.status(200).send({ message: "Workout deleted!" });
		} else {
			return res.status(400).send({ error: "Workout not found!" });
		}
	})
	.catch(error => {
		console.log(error);
		return res.status(500).send({ error: "Unable to delete workout!"});
	});
}

module.exports.completeWorkout = (req, res) => {
	const { name } = req.body;

	return Workout.findOneAndUpdate({ name: name }, { status: "completed" })
	.then(workout => {
		if(workout) {
			return res.status(200).send({ message: "Workout completed!" });
		} else {
			return res.status(400).send({ error: "Workout not found!" });
		}
	})
	.catch(error => {
		console.log(error);
		return res.status(500).send({ error: "Unable to complete workout!"});
	});
}