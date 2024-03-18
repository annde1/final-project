import { IWorkoutTemplate } from "./template";
import { IWorkout } from "./workout";

type IUser = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  age?: number;
  weight?: number;
  height?: number;
  isPremium: boolean;
  isModerator: boolean;
  file: any;
  alt: string;
  createdAt?: Date;
  followers?: string[];
  following?: string[];
};

type ILogin = {
  email: string;
  password: string;
};

type IJwtPayload = {
  _id: string;
  isPremium: boolean;
  isModerator: boolean;
  userName: string;
};
export { IUser, IName, IImage, ILogin, IJwtPayload };
