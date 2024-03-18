import Joi from "joi";

const schema = Joi.object({
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20).required(),
  userName: Joi.string().min(2).max(20).required(),
  email: Joi.string().min(7).max(100).required(),
  age: Joi.number().optional().allow(null),
  weight: Joi.number().optional().allow(null),
  height: Joi.number().optional().allow(null),
  file: Joi.any().optional().allow(null),
  alt: Joi.string().max(100).optional().allow(""),
});

export { schema as editProfileSchema };
