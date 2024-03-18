import Joi from "joi";
import { IWorkoutTemplate } from "../../@types/template";

const schema = Joi.object<IWorkoutTemplate>({
  name: Joi.string().min(1).max(80).required(),
  description: Joi.string().max(300).optional().allow(""),
  image: Joi.any().optional().allow(null),
  exercises: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(1).required(),
        sets: Joi.array()
          .items(
            Joi.object({
              reps: Joi.number().integer().min(1).required(),
              weight: Joi.number().min(0).required(),
            })
          )
          .min(1)
          .required(),
      })
    )
    .min(1)
    .required(),
});

export { schema as workoutTemplateSchema };
