import mongoose from "mongoose";

// Comment schema - stores comments on videos
const commentSchema = new mongoose.Schema(
  {
    // The video this comment belongs to
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    // The user who posted the comment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Comment text content
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Comment", commentSchema);
