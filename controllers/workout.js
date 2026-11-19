const User = require("../models/User");
const Workout = require("../models/Workout");
const { errorHandler } = require("../auth.js");

module.exports.addWorkout = (req, res) => {
	const { name, duration, userId } = req.body;

	if (req.user.id !== userId) {
		return res.status(403).send({ error: "Id must match with your account" });
	}

	return Workout.findOne({ name: name, userId: userId })
		.then(existingWorkout => {
			if (existingWorkout) {
				return res.status(409).send({ error: "Workout name already exists!" });
			}

			const newWorkout = new Workout({
				name: name,
				duration: duration,
				userId: userId
			});

			return newWorkout.save()
				.then(savedWorkout => res.status(201).send(savedWorkout));
		})
		.catch(err => errorHandler(err, req, res));
}

module.exports.getWorkouts = (req, res) => {
	const userId = req.user.id;

	return Workout.find({ userId: userId, userId: req.user.id })
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
	.catch(err => errorHandler(err, req, res));
}

module.exports.updateWorkout = (req, res) => {
	const { name, newName, newDuration } = req.body;

	const duplicateCheck = newName
		? Workout.findOne({ name: newName, userId: req.user.id })
		: Promise.resolve(null);

	return duplicateCheck
		.then(duplicateWorkout => {
			if (duplicateWorkout && duplicateWorkout.name !== name) {
				return res.status(409).send({ error: "A workout with that new name already exists!" });
			}

			let workoutUpdate = {
				name: newName,
				duration: newDuration
			};

			return Workout.findOneAndUpdate(
				{ name: name, userId: req.user.id },
				workoutUpdate,
				{ new: true }
			);
		})
		.then(updatedWorkout => {
			if (res.headersSent) return;
			if (updatedWorkout) {
				return res.status(200).send({ message: "Workout updated!" });
			} else {
				return res.status(400).send({ error: "Workout not found!" });
			}
		})
		.catch(error => {
			console.log(error);
			if (!res.headersSent) {
				return res.status(500).send({ error: "Unable to update workout!" });
			}
		});
};

module.exports.deleteWorkout = (req, res) => {
	const { name } = req.body;

	return Workout.findOneAndDelete({ name: name, userId: req.user.id })
	.then(workout => {
		if(workout) {
			return res.status(200).send({ message: "Workout deleted!" });
		} else {
			return res.status(400).send({ error: "Workout not found!" });
		}
	})
	.catch(err => errorHandler(err, req, res));
}

module.exports.completeWorkout = (req, res) => {
	const { name } = req.body;

	return Workout.findOneAndUpdate({ name: name, userId: req.user.id }, { status: "completed" })
	.then(workout => {
		if(workout) {
			return res.status(200).send({ message: "Workout completed!" });
		} else {
			return res.status(400).send({ error: "Workout not found!" });
		}
	})
	.catch(err => errorHandler(err, req, res));
}