import { Schema } from "mongoose";
import { IUser } from "../../@types/user";

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true,
  },
  lastName: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 20,
  },
  userName: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    minlength: 7,
    maxlength: 100,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  age: {
    type: Number,
    required: false,
    default: null,
  },
  weight: {
    type: Number,
    required: false,
    default: null,
  },
  height: {
    type: Number,
    required: false,
    default: null,
  },

  isPremium: {
    type: Boolean,
    required: true,
  },
  isModerator: {
    type: Boolean,
    required: false,
    default: false,
  },

  file: {
    type: Schema.Types.Mixed,
    required: false,
    default: "https://www.example.com/default-image.jpg",
  },
  alt: {
    type: String,
    required: false,
    default: "Profile Photo",
  },
  following: [
    {
      type: String,
      default: [],
      required: false,
    },
  ],
  followers: [
    {
      type: String,
      default: [],
      required: false,
    },
  ],
});

// userSchema.index({ email: 1 }, { unique: true });
export default userSchema;
