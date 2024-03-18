import { Exercise } from "../database/model/exercise";
import { ZenFitError } from "../error/app-error";

export const getAllExercises = async () => {
  const exercises = await Exercise.find();
  if (!exercises) {
    throw new ZenFitError("Exercises not found", 401);
  }
  return exercises;
};

export const getExerciseByName = async (exerciseName: string) => {
  const exercises = await Exercise.find({
    name: { $regex: new RegExp(`\\b${exerciseName}\\b`, "i") },
  });
  if (!exercises) {
    throw new ZenFitError("No exercises found with the matching name", 404);
  }
  return exercises;
};
