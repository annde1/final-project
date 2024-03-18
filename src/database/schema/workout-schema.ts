import { Schema } from "mongoose";
import { IWorkout } from "../../@types/workout";
import { templateSchema } from "./template-schema";

const workoutSchema = new Schema<IWorkout>({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  template: {
    type: templateSchema,
  },

  volume: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: false,
  },
  likes: [
    {
      type: String,
      required: false,
    },
  ],
  records: {
    type: Number,
    required: false,
    default: 0,
  },
});
export { workoutSchema };
