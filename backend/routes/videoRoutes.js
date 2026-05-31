import express from "express";
import mongoose from "mongoose";
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import Comment from "../models/Comment.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/videos - Fetch all videos
router.get("/", async (req, res) => {
  try {
    // Get search query and category from URL params
    const { search, category } = req.query;

    // Build filter object
    let filter = {};

    // Filter by category if provided
    if (category && category !== "All") {
      filter.category = category;
    }

    // Filter by title if search query provided
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Fetch videos with channel and uploader info
    const videos = await Video.find(filter)
      .populate("channelId", "channelName")
      .populate("uploader", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Videos fetched successfully",
      count: videos.length,
      videos: videos,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// GET /api/videos/:id - Fetch single video by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid video ID format",
      });
    }

    // Find video and populate related data
    const video = await Video.findById(id)
      .populate("channelId", "channelName description")
      .populate("uploader", "username avatar")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "username avatar",
        },
      });

    if (!video) {
      return res.status(404).json({
        error: "Not Found",
        message: "Video not found",
      });
    }

    // Increment view count each time video is fetched
    video.views += 1;
    await video.save();

    res.status(200).json({
      message: "Video fetched successfully",
      video: video,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// POST /api/videos - Upload a new video (protected)
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, channelId, category } =
      req.body;

    // Validate required fields
    if (!title || !videoUrl || !thumbnailUrl || !channelId) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Title, videoUrl, thumbnailUrl and channelId are required",
      });
    }

    // Check if channel exists and belongs to user
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        error: "Not Found",
        message: "Channel not found",
      });
    }

    // Make sure logged in user owns this channel
    if (channel.owner.toString() !== req.userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only upload to your own channel",
      });
    }

    // Create new video in database
    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      channelId,
      uploader: req.userId,
      category: category || "All",
    });

    // Add video reference to channel
    channel.videos.push(video._id);
    await channel.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      video: video,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// PUT /api/videos/:id - Update video details (protected)
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnailUrl, category } = req.body;

    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid video ID format",
      });
    }

    // Find the video
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({
        error: "Not Found",
        message: "Video not found",
      });
    }

    // Check if logged in user owns this video
    if (video.uploader.toString() !== req.userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only edit your own videos",
      });
    }

    // Update video fields
    video.title = title || video.title;
    video.description = description || video.description;
    video.thumbnailUrl = thumbnailUrl || video.thumbnailUrl;
    video.category = category || video.category;

    await video.save();

    res.status(200).json({
      message: "Video updated successfully",
      video: video,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// DELETE /api/videos/:id - Delete a video (protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid video ID format",
      });
    }

    // Find the video
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({
        error: "Not Found",
        message: "Video not found",
      });
    }

    // Check if logged in user owns this video
    if (video.uploader.toString() !== req.userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only delete your own videos",
      });
    }

    // Remove video from channel
    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: { videos: video._id },
    });

    // Delete all comments on this video
    await Comment.deleteMany({ videoId: id });

    // Delete the video
    await Video.findByIdAndDelete(id);

    res.status(200).json({
      message: "Video deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// PUT /api/videos/:id/like - Like a video (protected)
router.put("/:id/like", protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        error: "Not Found",
        message: "Video not found",
      });
    }

    // Remove from dislikes if present
    video.dislikes = video.dislikes.filter(
      (uid) => uid.toString() !== req.userId,
    );

    // Toggle like
    const alreadyLiked = video.likes.includes(req.userId);
    if (alreadyLiked) {
      video.likes = video.likes.filter((uid) => uid.toString() !== req.userId);
    } else {
      video.likes.push(req.userId);
    }

    await video.save();

    res.status(200).json({
      message: alreadyLiked ? "Like removed" : "Video liked",
      likes: video.likes.length,
      dislikes: video.dislikes.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// PUT /api/videos/:id/dislike - Dislike a video (protected)
router.put("/:id/dislike", protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        error: "Not Found",
        message: "Video not found",
      });
    }

    // Remove from likes if present
    video.likes = video.likes.filter((uid) => uid.toString() !== req.userId);

    // Toggle dislike
    const alreadyDisliked = video.dislikes.includes(req.userId);
    if (alreadyDisliked) {
      video.dislikes = video.dislikes.filter(
        (uid) => uid.toString() !== req.userId,
      );
    } else {
      video.dislikes.push(req.userId);
    }

    await video.save();

    res.status(200).json({
      message: alreadyDisliked ? "Dislike removed" : "Video disliked",
      likes: video.likes.length,
      dislikes: video.dislikes.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

export default router;
