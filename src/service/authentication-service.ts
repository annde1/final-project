import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { IJwtPayload } from "../@types/user";

const authentication = {
  hashPassword: (passwordStr: string, rounds = 12) => {
    return bcrypt.hash(passwordStr, rounds);
  },
  validatePassword: (passwordStr: string, hash: string) => {
    //Compare password provided by user with the hashed password
    return bcrypt.compare(passwordStr, hash);
  },
  generateJwtToken: (payload: IJwtPayload) => {
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret);
    return token;
  },
  extractToken: (req: Request): string => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      throw new Error("Token is missing in authorization headers");
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new Error("Invalid Authorization header format");
    }

    return token;
  },
  verifyJwtToken: (token: string) => {
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret);

    return payload as IJwtPayload;
  },
};
export default authentication;
