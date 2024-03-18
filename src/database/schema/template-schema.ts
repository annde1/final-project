import { Schema } from "mongoose";
import { IWorkoutTemplate } from "../../@types/template";

const templateSchema = new Schema<IWorkoutTemplate>({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 80,
  },
  userId: {
    type: String,
    required: false,
  },
  exercises: [
    {
      name: {
        type: String,
        required: true,
      },
      sets: [
        {
          reps: {
            type: Number,
            required: true,
          },
          weight: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
  description: {
    type: String,
    required: false,
    maxlength: 300,
  },
  image: {
    type: Schema.Types.Mixed,
    required: false,
    default: "https://i.imgur.com/gsWmt2W.jpg",
  },
});
export { templateSchema };
