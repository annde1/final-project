import Joi from "joi";

const validation = (schema: Joi.ObjectSchema, input: any) => {
  const { error } = schema.validate(input);
  if (!error) {
    return null;
  }
  const errorMessages = error.details
    .map((detail) => detail.message)
    .map((msg) => msg.replace(/"/g, ""));
  return errorMessages;
};
export default validation;
