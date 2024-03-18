import { RequestHandler } from "express";
import authentication from "../service/authentication-service";
import { User } from "../database/model/user";
import { ZenFitError } from "../error/app-error";

export const isUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = authentication.extractToken(req);
    const { _id } = authentication.verifyJwtToken(token);
    const user = await User.findOne({ _id: _id }).lean();

    if (!user) {
      throw new ZenFitError("User doesn't exist", 404);
    }
    if (id.toString() == user._id.toString()) {
      return next();
    }
    throw new ZenFitError("Unauthorized. The id must belong to the user", 401);
  } catch (err) {
    next(err);
  }
};
