import { Schema } from "mongoose";
import { IExercise } from "../../@types/exercise";

const exerciseSchema = new Schema<IExercise>({
  name: String,
  category: String,
});
export { exerciseSchema };
