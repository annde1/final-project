import { RequestHandler } from "express";
import authentication from "../service/authentication-service";
import { User } from "../database/model/user";
import { Template } from "../database/model/template";
import { ZenFitError } from "../error/app-error";

const isOwnerOrAdmin: RequestHandler = async (req, res, next) => {
  try {
    ///Extract token
    const token = authentication.extractToken(req);
    //Verify token and get payload
    const { _id } = authentication.verifyJwtToken(token);
    //Find user in the database by email
    const user = await User.findOne({ _id: _id });
    if (!user) {
      throw new ZenFitError("User not found", 404);
    }
    //Get user id
    const userId = user._id;
    ///Extract template id from request params
    const templateId = req.params.id;
    //Find template in database
    const template = await Template.findById({ _id: templateId });
    //If no template was found return error
    if (!template) {
      throw new ZenFitError("Template doesn't exist", 404);
    }
    if (template.userId.toString() === userId.toString()) {
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
export { isOwnerOrAdmin };
