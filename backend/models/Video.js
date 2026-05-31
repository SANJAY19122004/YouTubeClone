import mongoose from "mongoose";

// Video schema - stores video data
const videoSchema = new mongoose.Schema(
  {
    // Video title
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    // Video description
    description: {
      type: String,
      default: "",
    },

    // URL of the video
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },

    // Thumbnail image URL
    thumbnailUrl: {
      type: String,
      required: [true, "Thumbnail URL is required"],
    },

    // Channel that uploaded this video
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },

    // User who uploaded this video
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Category of the video for filtering
    category: {
      type: String,
      default: "All",
      enum: [
        "All",
        "Web Development",
        "JavaScript",
        "React",
        "Node.js",
        "Python",
        "Data Science",
        "Gaming",
        "Music",
        "News",
      ],
    },

    // View count
    views: {
      type: Number,
      default: 0,
    },

    // List of user IDs who liked this video
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // List of user IDs who disliked this video
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Comments on this video
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    // Upload date
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Video", videoSchema);
