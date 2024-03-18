import Joi from "joi";
import { IWorkout } from "../../@types/workout";
import { IExercise, IWorkoutTemplate, ISet } from "../../@types/template";

const schema = Joi.object<IWorkout>({
  title: Joi.string().min(2).max(30).required(),
  createdAt: Joi.date().required(),
  duration: Joi.number().required(),
  template: Joi.object<IWorkoutTemplate>({
    name: Joi.string().min(2).max(30).required(),
    exercises: Joi.array().items(
      Joi.object<IExercise>({
        name: Joi.string().min(2).max(30).required(),
        sets: Joi.array().items(
          Joi.object<ISet>({
            reps: Joi.number().required(),
            weight: Joi.number().required(),
          })
        ),
      })
    ),
  }),

  volume: Joi.number().required(),
});

export { schema as workoutSchema };
