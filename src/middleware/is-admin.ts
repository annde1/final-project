import { RequestHandler } from "express";
import { User } from "../database/model/user";
import authentication from "../service/authentication-service";
import { ZenFitError } from "../error/app-error";

export const isAdmin: RequestHandler = async (req, res, next) => {
  try {
    const token = authentication.extractToken(req);
    const { _id } = authentication.verifyJwtToken(token);
    const user = await User.findById({ _id: _id }).lean();
    if (!user) {
      throw new ZenFitError("User doesn't exist", 404);
    }

    const isAdmin = user.isModerator;
    if (isAdmin) {
      return next();
    }
    throw new ZenFitError("Unauthorized", 401);
  } catch (err) {
    next(err);
  }
};
