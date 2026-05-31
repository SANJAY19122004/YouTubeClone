import express from "express";
import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/comments - Add a comment to a video (protected)
router.post("/", protect, async (req, res) => {
  try {
    const { videoId, text } = req.body;

    // Validate required fields
    if (!videoId || !text) {
      return res.status(400).json({
        error: "Bad Request",
        message: "videoId and text are required",
      });
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        error: "Not Found",
        message: "Video not found",
      });
    }

    // Create new comment
    const comment = await Comment.create({
      videoId,
      userId: req.userId,
      text,
    });

    // Add comment reference to video
    video.comments.push(comment._id);
    await video.save();

    // Populate user info before sending response
    const populatedComment = await Comment.findById(comment._id).populate(
      "userId",
      "username avatar",
    );

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// GET /api/comments/:videoId - Get all comments for a video
router.get("/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;

    // Check if videoId is valid
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid video ID format",
      });
    }

    // Fetch all comments for this video
    const comments = await Comment.find({ videoId })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Comments fetched successfully",
      count: comments.length,
      comments: comments,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// PUT /api/comments/:id - Edit a comment (protected)
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Validate text field
    if (!text) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Comment text is required",
      });
    }

    // Find the comment
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        error: "Not Found",
        message: "Comment not found",
      });
    }

    // Check if logged in user owns this comment
    if (comment.userId.toString() !== req.userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only edit your own comments",
      });
    }

    // Update comment text
    comment.text = text;
    await comment.save();

    const updatedComment = await Comment.findById(id).populate(
      "userId",
      "username avatar",
    );

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// DELETE /api/comments/:id - Delete a comment (protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the comment
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        error: "Not Found",
        message: "Comment not found",
      });
    }

    // Check if logged in user owns this comment
    if (comment.userId.toString() !== req.userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only delete your own comments",
      });
    }

    // Remove comment reference from video
    await Video.findByIdAndUpdate(comment.videoId, {
      $pull: { comments: comment._id },
    });

    // Delete the comment
    await Comment.findByIdAndDelete(id);

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

export default router;
