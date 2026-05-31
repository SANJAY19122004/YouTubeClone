import mongoose from "mongoose";

// Channel schema - stores channel data for each user
const channelSchema = new mongoose.Schema(
  {
    // Channel name
    channelName: {
      type: String,
      required: [true, "Channel name is required"],
      trim: true,
    },

    // Owner of the channel - reference to User
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Channel description
    description: {
      type: String,
      default: "",
    },

    // Channel banner image URL
    channelBanner: {
      type: String,
      default: "",
    },

    // Number of subscribers
    subscribers: {
      type: Number,
      default: 0,
    },

    // List of video IDs belonging to this channel
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Channel", channelSchema);
