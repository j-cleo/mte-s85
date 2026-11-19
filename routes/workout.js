const express = require('express');
const workoutController = require('../controllers/workout');
const { verify } = require('../auth');

const router = express.Router();

router.post("/addWorkout", verify, workoutController.addWorkout);
router.get("/getMyWorkouts", verify, workoutController.getWorkouts);
router.patch("/updateWorkout", verify, workoutController.updateWorkout);
router.delete("/deleteWorkout", verify, workoutController.deleteWorkout);
router.patch("/completeWorkoutStatus", verify, workoutController.completeWorkout);

module.exports = router;