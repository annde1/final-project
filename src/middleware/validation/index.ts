import { validateDataSchema, validateSchema } from "./validate-schema";
import { userSchema } from "../../validation/joi/user-joi";
import { workoutTemplateSchema } from "../../validation/joi/template-joi";
import { workoutSchema } from "../../validation/joi/workout-joi";
import { loginSchema } from "../../validation/joi/login-joi";
import { editProfileSchema } from "../../validation/joi/edit-profile-joi";
const validateUserRegistration = validateSchema(userSchema);
const validateTemplate = validateSchema(workoutTemplateSchema);
const validateTemplateData = validateDataSchema(workoutTemplateSchema);
const validateWorkout = validateSchema(workoutSchema);
const validateUserLogin = validateSchema(loginSchema);
const validateEditProfile = validateSchema(editProfileSchema);

export {
  validateUserRegistration,
  validateTemplate,
  validateWorkout,
  validateUserLogin,
  validateEditProfile,
  validateTemplateData,
};
