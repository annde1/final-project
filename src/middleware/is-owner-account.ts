import { RequestHandler } from "express";
import { User } from "../database/model/user";
import authentication from "../service/authentication-service";
import { ZenFitError } from "../error/app-error";

export const isOwnerOrAdmin: RequestHandler = async (req, res, next) => {
  try {
    //extract token
    const token = authentication.extractToken(req);
    //verify token
    const { _id } = authentication.verifyJwtToken(token);
    const { id } = req.params;
    const user = await User.findOne({ _id: _id });
    if (!user) {
      throw new ZenFitError("User not found", 404);
    }
    const userId = user._id;

    if (userId.toString() === id.toString()) {
      return next();
    }
    if (user.isModerator) {
      return next();
    }
    //the user wasn't owner or admin throw error
    throw new ZenFitError(
      "Unauthorized: You must be owner of the account or moderator",
      401
    );
  } catch (err) {
    next(err);
  }
};
