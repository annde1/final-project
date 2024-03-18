import { Router } from "express";
import { validateUserRegistration } from "../middleware/validation";
import { validateUserLogin } from "../middleware/validation";
import {
  createUser,
  deleteUser,
  editUser,
  followUser,
  getFollowers,
  getFollowing,
  getUserById,
  getUserByUsername,
  searchUserByQuery,
  toggleIsPremium,
  unfollowUser,
  validateUser,
} from "../service/user-service";
import { isUser } from "../middleware/is-user";
import { isOwnerOrAdmin } from "../middleware/is-owner-account";
import { User } from "../database/model/user";
import { ZenFitError } from "../error/app-error";
import { validateToken } from "../middleware/validate-token";
import { validateEditProfile } from "../middleware/validation";
import { uploadToFirebase } from "../service/upload-service";
import upload from "../middleware/upload";

//Create router
const router = Router();

//Route for retrieving following users
router.get("/following", validateToken, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const users = await getFollowing(userId);
    res.status(200).json({ message: "OK", following: users });
  } catch (err) {
    next(err);
  }
});

//Route for retrieving followers
router.get("/followers", validateToken, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const followers = await getFollowers(userId);
    res.status(200).json({ message: "OK", followers: followers });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  upload.single("file"),
  validateUserRegistration,
  async (req, res, next) => {
    try {
      //Upload the image to firebase storage
      const imageUrl = await uploadToFirebase(req, "profile");
      //Create user and save it in the database
      const user = await createUser(req.body, imageUrl);
      res.status(201).json({ message: "User Saved", userDetails: user });
    } catch (err) {
      next(err);
    }
  }
);

//Route for user login
router.post("/login", validateUserLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await validateUser(email, password);
    res.status(201).json({ message: "OK", token: token });
  } catch (err) {
    next(err);
  }
});

//Route for deleting user:
router.delete("/:id", isOwnerOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await deleteUser(id);
    res.status(201).json({ message: "User deleted", userDetails: user });
  } catch (err) {
    next(err);
  }
});

//Roue for changin isPremium status of user

router.patch("/:id", isOwnerOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await toggleIsPremium(id);
    res.status(201).json({ message: "OK", userDetails: user });
  } catch (err) {
    next(err);
  }
});

//Route for editing user
router.put(
  "/:id",
  isUser,
  upload.single("file"),
  validateEditProfile,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const imageUrl = await uploadToFirebase(req, "profile");
      const user = await editUser(id, req.body, imageUrl);
      res
        .status(201)
        .json({ message: "User details updated", userDetails: user });
    } catch (err) {
      next(err);
    }
  }
);

//?? Ask for explanation
router.get("/", validateToken, async (req, res, next) => {
  try {
    const isAdmin = req.user.isModerator;
    const { query } = req.query;
    const stringQuery = query ? query.toString() : "";
    const users = await searchUserByQuery(stringQuery, isAdmin ? -1 : 10);
    res.status(200).json({ message: "OK", users: users });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//Follow user
router.patch("/follow/:id", validateToken, async (req, res, next) => {
  try {
    //The id of follower
    const followerId = req.user._id;
    //The following id
    const { id: followingId } = req.params;
    const followedUser = await followUser(followerId, followingId);
    res
      .status(201)
      .json({ message: "User followed", userDetails: followedUser });
  } catch (err) {
    next(err);
  }
});

//Unfollow user
router.patch("/unfollow/:id", validateToken, async (req, res, next) => {
  try {
    const followerId = req.user._id;
    const { id: followingId } = req.params;
    const unfollowedUser = await unfollowUser(followerId, followingId);
    res
      .status(201)
      .json({ message: "User unfollowed", userDetails: unfollowedUser });
  } catch (err) {
    next(err);
  }
});

//Get user by id
router.get("/:id", validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    res.status(201).json({ message: "OK", userData: user });
  } catch (err) {
    next(err);
  }
});

export { router as usersRouter };
