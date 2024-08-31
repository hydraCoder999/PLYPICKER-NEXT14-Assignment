import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [4, "Minimum name character length is 4"],
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: [4, "Minimum name character length is 4"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["ADMIN", "TEAM_MEMBER"],
    },
    isVerifiedUser: {
      type: Boolean,
      default: false,
    },
    verifyUserToken: {
      type: String,
    },
    verifyUserExpired: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
