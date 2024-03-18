import Joi from "joi";
import { IUser } from "../../@types/user";
import { passwordRegex } from "../patterns";
const schema = Joi.object<IUser>({
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20).required(),
  userName: Joi.string().min(2).max(20).required(),
  email: Joi.string().min(7).max(100).required(),
  password: Joi.string().min(8).pattern(passwordRegex).required(),
  age: Joi.number().optional().allow(0),
  weight: Joi.number().optional().allow(null),
  height: Joi.number().optional().allow(null),
  isPremium: Joi.boolean().required(),
  file: Joi.any().optional().allow(null),
  alt: Joi.string().max(100).optional().allow(""),
});

export { schema as userSchema };
