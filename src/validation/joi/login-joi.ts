import Joi from "joi";
import { ILogin } from "../../@types/user";
import { passwordRegex } from "../patterns";
const schema = Joi.object<ILogin>({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex).required(),
});

export { schema as loginSchema };
