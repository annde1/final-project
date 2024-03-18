import { IUser } from "../@types/user";
import { User } from "../database/model/user";
import { ZenFitError } from "../error/app-error";
import authentication from "./authentication-service";

export const validateUser = async (email: string, password: string) => {
  //Check if user exists in the database
  const user = await User.findOne({ email });
  //If no user was found throw error
  if (!user) {
    throw new ZenFitError("User with provided email doesn't exist", 401);
  }

  //Check if password is valid
  const isPasswordValid = await authentication.validatePassword(
    password, //actual password
    user.password //encrypted password
  );

  //If password is not valid throw error
  if (!isPasswordValid) {
    throw new ZenFitError("Your password is incorrect", 401);
  }

  const userId = user._id.toString();
  const isPremium = user.isPremium;
  const userName = user.userName;
  const isModerator = user.isModerator;
  //Password valid so can generate token
  const token = authentication.generateJwtToken({
    _id: userId,
    isPremium: isPremium,
    userName: userName,
    isModerator: isModerator,
  });

  return { token };
};

export const createUser = async (userDetails: IUser, imgUrl: string) => {
  const user = new User(userDetails);
  user.password = await authentication.hashPassword(user.password);
  user.file = imgUrl;
  const savedUser = await user.save();
  return savedUser;
};

export const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete({ _id: userId });
  if (!user) {
    throw new ZenFitError("User not found", 404);
  }
  return user;
};

export const toggleIsPremium = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ZenFitError("User not found", 404);
  }
  const newStatus = !user.isPremium;
  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    { isPremium: newStatus },
    { new: true }
  ).lean();
  return updatedUser;
};

export const editUser = async (
  userId: string,
  userData: any,
  imgUrl: string
) => {
  const updatedData = { ...userData, file: imgUrl };
  const user = await User.findByIdAndUpdate({ _id: userId }, updatedData, {
    new: true,
  }).lean();
  if (!user) {
    throw new Error("User does not exist");
  }
  const { password, ...userRest } = user;
  return userRest;
};

export const getUserByUsername = async (userName: string) => {
  const user = await User.findOne({ userName: userName }).lean();
  if (!user) {
    throw new ZenFitError("User not found", 404);
  }
  const { password, ...rest } = user;
  return rest;
};

export const searchUserByQuery = async (userQuery: string, limit: number) => {
  const trimmedUserQuery = userQuery.trim();
  if (trimmedUserQuery.length == 0) {
    if (limit === -1) {
      return User.find({}); //if limit is -1 then get all users for admin
    }
    return User.find({}).limit(limit); // default behavior: Get all users
  }

  const searchParts = [];
  for (const part of trimmedUserQuery.split(" ")) {
    const cleanPart = part.trim();
    if (!cleanPart) {
      continue; // Skip empty strings
    }

    searchParts.push(
      { "name.firstName": new RegExp(`.*${cleanPart}.*`, "ig") },
      { "name.lastName": new RegExp(`.*${cleanPart}.*`, "ig") }
    );
  }

  // I chose to use $or because there are not users :-(
  const searchQuery = { $or: searchParts };
  const users = await User.find(searchQuery).limit(limit);
  if (!users || users.length === 0) {
    throw new ZenFitError("User doesn't exists", 404);
  }
  return users;
};

export const getFollowing = async (userId: string) => {
  const users = await User.find({ followers: { $in: [userId] } }).select(
    "-password" //exclude password
  );
  return users;
};

export const getFollowers = async (userId: string) => {
  const followers = await User.find({ following: { $in: [userId] } }).select(
    "-password"
  );
  return followers;
};

export const followUser = async (followerId: string, followingId: string) => {
  const followedUser = await User.findByIdAndUpdate(
    followingId,
    { $push: { followers: followerId } },
    { new: true }
  );

  if (!followedUser) {
    throw new ZenFitError("User Not Found", 404);
  }
  //Update following array of following user
  await User.findByIdAndUpdate(
    followerId,
    { $push: { following: followingId } },
    { new: true }
  );
  return followedUser;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  //Find the followed user in the database
  const followedUser = await User.findById(followingId);
  if (!followedUser) {
    throw new ZenFitError("User Not Found", 404);
  }

  //Returns true or false
  const isFollowing = followedUser.followers.includes(followerId);
  if (isFollowing) {
    //if isFollowing is true then remove then unfollow
    const unfollowedUser = await User.findByIdAndUpdate(
      followingId,
      { $pull: { followers: followerId } },
      { new: true }
    ).lean();
    //If user deleted the account in the meanwhile
    if (!unfollowedUser) {
      throw new ZenFitError("User not found", 404);
    }
    return unfollowedUser;
  }
};

export const getUserById = async (userId: string) => {
  const user = await User.findById({ _id: userId })
    .select(
      "-password" //exclude password
    )
    .lean();

  if (!user) {
    throw new ZenFitError("User not found", 404);
  }
  return user;
};
