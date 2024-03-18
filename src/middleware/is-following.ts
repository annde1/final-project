import { RequestHandler } from "express";
import { User } from "../database/model/user";
import { ZenFitError } from "../error/app-error";

// export const isFollowing: RequestHandler = async (req, res, next) => {
//   try {
//     //get id of the user
//     const userId = req.user._id;
//     //extract username from params
//     const { userName } = req.params;
//     //return next - go to next (filter)
//     if (!userName) {
//       return next();
//     }
//     //find the user in the database
//     const user = await User.findOne({ userName: userName });
//     if (!user) {
//       throw new ZenFitError("User does not exist", 404);
//     }
//     //Check if the user is following the other user
//     const isFollowing = user.followers.includes(userId.toString());
//     //If not return error
//     if (!isFollowing) {
//       throw new ZenFitError(
//         "You must follow the user to access their feeds",
//         401
//       );
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// };
