import mongoose from "mongoose";
import { templateSchema } from "../schema/template-schema";

const Template = mongoose.model("template", templateSchema);

export { Template };
