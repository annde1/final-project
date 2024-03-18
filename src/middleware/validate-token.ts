import { User } from "../database/model/user";
import { ZenFitError } from "../error/app-error";
import authentication from "../service/authentication-service";
import { RequestHandler } from "express";
const validateToken: RequestHandler = async (req, res, next) => {
  try {
    const token = authentication.extractToken(req); //extract token from headers
    const { _id } = authentication.verifyJwtToken(token); //verify and get payload
    const user = await User.findOne({ _id: _id }); //find user

    if (!user) {
      throw new ZenFitError("User not found", 404);
    }
    //attach user to the request
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
export { validateToken };
