import mongoose from "mongoose";
import { workoutSchema } from "../schema/workout-schema";

const Workout = mongoose.model("workout", workoutSchema);

export { Workout };
