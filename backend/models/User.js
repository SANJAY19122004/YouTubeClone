import mongoose from "mongoose";

// User schema - stores registered user data
const userSchema = new mongoose.Schema(
  {
    // Username must be unique
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },

    // Email must be unique
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },

    // Hashed password
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // Avatar URL - default avatar if not provided
    avatar: {
      type: String,
      default: "https://www.gravatar.com/avatar/?d=mp",
    },

    // List of channel IDs owned by this user
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
