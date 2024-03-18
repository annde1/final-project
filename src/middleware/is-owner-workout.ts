import { RequestHandler } from "express";
import { User } from "../database/model/user";
import authentication from "../service/authentication-service";
import { Workout } from "../database/model/workout";
import { ZenFitError } from "../error/app-error";

export const isOwnerOrAdmin: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = authentication.extractToken(req);
    const { _id } = authentication.verifyJwtToken(token);
    const user = await User.findOne({ _id: _id });
    if (!user) {
      throw new ZenFitError("User not found", 404);
    }
    const workout = await Workout.findOne({ _id: id });

    if (workout.userId.toString() === _id) {
      return next();
    }
    if (user.isModerator) {
      return next();
    }
    throw new ZenFitError("Unauthorized", 401);
  } catch (err) {
    next(err);
  }
};
