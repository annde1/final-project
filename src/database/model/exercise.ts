import mongoose from "mongoose";
import { exerciseSchema } from "../schema/exercise-schema";

const Exercise = mongoose.model("exercise", exerciseSchema);

export { Exercise };
