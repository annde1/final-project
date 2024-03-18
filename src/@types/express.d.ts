import { Request } from "express";
declare global {
  namespace Express {
    interface Request {
      user?: User;
      template?: Template;
      followingUsers: FollowingUsers;
    }
  }
}
