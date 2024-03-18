import express, { json } from "express";
import { connect } from "./database/connection";
import configEnv from "./config";
import { usersRouter } from "./routes/user";
import { templateRouter } from "./routes/template";
import { workoutRouter } from "./routes/workout";
import { exercisesRouter } from "./routes/exercises";
import { errorHandler } from "./middleware/error-handler";
import cors from "cors";
import morgan from "morgan";
import { logger } from "./service/logger";

configEnv();
connect();
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(json()); //use body parser
app.use("/api/v1/users", usersRouter); //router for users
app.use("/api/v1/templates", templateRouter); //router for templatess
app.use("/api/v1/workouts", workoutRouter);
app.use("/api/v1/exercises", exercisesRouter);
app.use(errorHandler);
app.listen(process.env.PORT || 7500, () => {
  logger.info("App running on port 7500");
});
