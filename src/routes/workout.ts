import { Router } from "express";
import { Workout } from "../database/model/workout";
import { validateWorkout } from "../middleware/validation";
import { isPremium } from "../middleware/is-premium";
import {
  createWorkout,
  deleteWorkout,
  editWorkout,
  getUserWorkouts,
  getWorkoutFeedsFilters,
  getWorkoutFeedsFiltersForUser,
  likeWorkout,
} from "../service/workout-service";
import { validateToken } from "../middleware/validate-token";
import { isAdmin } from "../middleware/is-admin";
import { isOwnerOrAdmin } from "../middleware/is-owner-workout";
const router = Router();

//Route for creating new workout. User will created workout from the templates he owns
router.post("/", isPremium, validateWorkout, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const workout = await createWorkout(req.body, userId);
    res.status(201).json({ message: "Workout Created", details: workout });
  } catch (err) {
    next(err);
  }
});
//Route to delte workout
router.delete("/:id", isOwnerOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const workout = await deleteWorkout(id);
    res
      .status(201)
      .json({ message: "Workout Deleted", workoutDetails: workout });
  } catch (err) {
    next(err);
  }
});

//Route for getting all workouts (only for admin)
router.get("/", isAdmin, async (req, res, next) => {
  try {
    const workouts = await Workout.find({});
    res.status(201).json({ message: "OK", workouts: workouts });
  } catch (err) {
    next(err);
  }
});

//Route for getting feeds
router.get("/feeds", validateToken, async (req, res, next) => {
  try {
    let { filter, userName } = req.query;
    //initialize the result array
    let result: any[];
    //If user name was provided then the result will be the result of getWorkoutFeedsFiltersForUser
    if (userName) {
      result = await getWorkoutFeedsFiltersForUser(
        userName as string,
        filter as string
      );
    } else {
      // There is no username the result will be the result of getWorkoutFeedsFilters (filtered workouts)
      result = await getWorkoutFeedsFilters(
        { userId: { $in: req.user.following } },
        filter as string
      );
    }

    // Format the result for the http response
    return res.status(200).json({ message: "OK", feeds: result });
  } catch (err) {
    next(err);
  }
});

//Get workout by id
router.get("/:id", validateToken, async (req, res, next) => {
  try {
    let { filter } = req.query;
    let { id } = req.params;
    const result = await getWorkoutFeedsFilters(
      { userId: id as string },
      filter as string
    );

    return res.status(200).json({ message: "OK", workouts: result });
  } catch (err) {
    next(err);
  }
});

//Get all user's workouts
router.get("/my-workouts", validateToken, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const workouts = await getUserWorkouts(_id);
    res.status(201).json({ message: "OK", workouts: workouts });
  } catch (err) {
    next(err);
  }
});

//Route for updating workout
router.put("/:id", isOwnerOrAdmin, validateWorkout, async (req, res, next) => {
  try {
    const { id } = req.params;
    const workout = await editWorkout(req.body, id);
    res.status(201).json({ message: "Workout edited", details: workout });
  } catch (err) {
    next(err);
  }
});

//Route for liking a workout
router.patch("/:id", validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const workout = await likeWorkout(id, userId);
    res.status(201).json({ message: "OK", workoutDetails: workout });
  } catch (err) {
    next(err);
  }
});
export { router as workoutRouter };
