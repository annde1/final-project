import { ErrorRequestHandler } from "express";
import { ZenFitError } from "../error/app-error";
import { logger } from "../service/logger";
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ZenFitError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: "Invalid JSON Format" });
  }
  if (err.code === 11000 && err.keyValue) {
    return res
      .status(400)
      .json({ message: "Duplicate Key", property: err.keyValue });
  }

  logger.error(err.message); //use winstong logger to log error
  return res.status(500).json({ message: "Internval Server Error" });
};
