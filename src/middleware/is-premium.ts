import { RequestHandler } from "express";
import authentication from "../service/authentication-service";
import { User } from "../database/model/user";
import { Template } from "../database/model/template";
import { ZenFitError } from "../error/app-error";

const isPremium: RequestHandler = async (req, res, next) => {
  try {
    // Extract token from the request headers
    const token = authentication.extractToken(req);
    // Verify the token and get payload
    const { _id } = authentication.verifyJwtToken(token);
    // Find user in the database:
    const user = await User.findOne({ _id: _id });
    if (!user) {
      throw new ZenFitError("user not found", 404);
    }
    // Attach user to request
    req.user = user;
    // If user has more than 3 templates and is not premium
    const isPremium = user?.isPremium; // false or true
    const userTemplates = await Template.find({ userId: user._id });
    if (userTemplates.length >= 3 && !isPremium) {
      throw new ZenFitError(
        "You have exceeded the limit of allowed templates. Upgrade to premium to create more.",
        403
      );
    }
    // Continue to the next middleware or route handler
    return next();
  } catch (err) {
    next(err);
  }
};

export { isPremium };
