import { IWorkout } from "../@types/workout";
import { Workout } from "../database/model/workout";
import { ZenFitError } from "../error/app-error";
import { User } from "../database/model/user";

export const findPreviousWorkout = async (
  templateName: string,
  userId: string
) => {
  const previousWorkout = await Workout.findOne({
    "template.name": templateName,
    userId: userId,
  }).sort({ createdAt: -1 });
  return previousWorkout;
};

export const calcRecords = async (
  newWorkout: IWorkout,
  prevWorkout: IWorkout
) => {
  const newWorkoutExercises = newWorkout.template.exercises;

  let getMaxReps = (sets) => Math.max(...sets.map((set) => set.reps));
  let getMaxWeight = (sets) => Math.max(...sets.map((set) => set.weight));

  const exercisesByName = {};
  for (const excercise of newWorkoutExercises) {
    exercisesByName[excercise.name] = {
      maxReps: getMaxReps(excercise.sets),
      maxWeight: getMaxWeight(excercise.sets),
    };
  }

  let records = 0;
  const previousWorkoutExercises = prevWorkout.template.exercises;
  for (const prev of previousWorkoutExercises) {
    const prevName = prev.name;
    if (!(prevName in exercisesByName)) {
      continue;
    }

    // The prev excersize was repeated again
    const prevMaxReps = getMaxReps(prev.sets);
    const prevMaxWeight = getMaxWeight(prev.sets);

    const current = exercisesByName[prevName];

    records = current.maxWeight > prevMaxWeight ? records + 1 : records;
    records = current.maxReps > prevMaxReps ? records + 1 : records;
  }

  return records;
};
export const createWorkout = async (workoutData: IWorkout, userId: string) => {
  const prevWorkout = await findPreviousWorkout(
    workoutData.template.name,
    userId
  );

  const recordCount = prevWorkout
    ? await calcRecords(workoutData, prevWorkout)
    : 0;
  // Set the record property in the new workout
  workoutData.records = recordCount;
  const workout = new Workout(workoutData);
  workout.userId = userId;

  const savedWorkout = await workout.save();
  return savedWorkout;
};

export const deleteWorkout = async (workoutId: string) => {
  const workout = await Workout.findByIdAndDelete(workoutId).lean();
  if (!workout) {
    throw new Error("Workout not found");
  }
  return workout;
};

export const getUserWorkouts = async (userId: string) => {
  const workouts = await Workout.find({ userId: userId });
  return workouts;
};

export const editWorkout = async (workoutData: any, workoutId: string) => {
  const workout = await Workout.findByIdAndUpdate(
    { _id: workoutId },
    workoutData,
    { new: true }
  ).lean();

  if (!workout) {
    throw new Error("Card not found");
  }

  return workout;
};

export const likeWorkout = async (workoutId: string, userId: string) => {
  const workout = await Workout.findById({ _id: workoutId });
  if (!workout) {
    throw new ZenFitError("Workout Not Found", 404);
  }

  const isLiked = workout.likes.includes(userId);

  const updateLikesArray = isLiked
    ? { $pull: { likes: userId } }
    : { $push: { likes: userId } };

  const updatedWorkout = await Workout.findByIdAndUpdate(
    workoutId,
    updateLikesArray,
    { new: true }
  );
  if (!updatedWorkout) {
    throw new ZenFitError("Card not found", 404);
  }
  return updatedWorkout;
};

export const getWorkoutFeedsFiltersForUser = async (
  userName: string,
  filter: string
) => {
  //Find the user in the database
  const user = await User.findOne({ userName: userName });
  if (!user) {
    throw new ZenFitError(`User ${userName} not found`, 404);
  }
  //Get user id
  const userId = user._id.toString();
  return await getWorkoutFeedsFilters({ userId: userId }, filter);
};

export const getWorkoutFeedsFilters = async (query: object, filter: string) => {
  // If there is not filter set, we should query according to "NewestToOldest" (default)
  switch (filter) {
    case "LowestToHighest":
      const sortedByLikesAscending = await Workout.aggregate([
        { $match: query },
        { $addFields: { likesCount: { $size: "$likes" } } },
        { $sort: { likesCount: 1 } },
      ]);
      return sortedByLikesAscending;

    case "HighestToLowest":
      const sortedByLikesDescending = await Workout.aggregate([
        { $match: query },
        { $addFields: { likesCount: { $size: "$likes" } } },
        { $sort: { likesCount: -1 } },
      ]);
      return sortedByLikesDescending;

    case "OldestToNewest":
      const sortedByOldestToNewest = await Workout.find(query).sort({
        createdAt: 1,
      });
      return sortedByOldestToNewest;

    case "NewestToOldest":
    default:
      const sortedByNewestToOldest = await Workout.find(query).sort({
        createdAt: -1,
      });
      return sortedByNewestToOldest;
  }
};

export const getWorkoutFeeds = async (followingUsers: string[]) => {
  const allFeeds = await Workout.find({ userId: { $in: followingUsers } });
  return allFeeds;
};
