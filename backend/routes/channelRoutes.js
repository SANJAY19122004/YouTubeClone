import express from "express";
import mongoose from "mongoose";
import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/channels - Create a new channel (protected)
router.post("/", protect, async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    // Validate required fields
    if (!channelName) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Channel name is required",
      });
    }

    // Check if user already has a channel with same name
    const existing = await Channel.findOne({
      owner: req.userId,
      channelName,
    });
    if (existing) {
      return res.status(400).json({
        error: "Bad Request",
        message: "You already have a channel with this name",
      });
    }

    // Create new channel
    const channel = await Channel.create({
      channelName,
      description: description || "",
      channelBanner: channelBanner || "",
      owner: req.userId,
    });

    // Add channel reference to user
    await User.findByIdAndUpdate(req.userId, {
      $push: { channels: channel._id },
    });

    res.status(201).json({
      message: "Channel created successfully",
      channel: channel,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// GET /api/channels/:id - Get channel details by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid channel ID format",
      });
    }

    // Find channel and populate videos and owner
    const channel = await Channel.findById(id)
      .populate("owner", "username avatar")
      .populate({
        path: "videos",
        populate: {
          path: "uploader",
          select: "username",
        },
      });

    if (!channel) {
      return res.status(404).json({
        error: "Not Found",
        message: "Channel not found",
      });
    }

    res.status(200).json({
      message: "Channel fetched successfully",
      channel: channel,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// GET /api/channels/user/my - Get all channels of logged in user
router.get("/user/my", protect, async (req, res) => {
  try {
    // Find all channels owned by logged in user
    const channels = await Channel.find({ owner: req.userId }).populate(
      "videos",
    );

    res.status(200).json({
      message: "Channels fetched successfully",
      channels: channels,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// PUT /api/channels/:id - Update channel details (protected)
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { channelName, description, channelBanner } = req.body;

    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid channel ID format",
      });
    }

    // Find channel
    const channel = await Channel.findById(id);
    if (!channel) {
      return res.status(404).json({
        error: "Not Found",
        message: "Channel not found",
      });
    }

    // Check if logged in user owns this channel
    if (channel.owner.toString() !== req.userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only edit your own channel",
      });
    }

    // Update channel fields
    channel.channelName = channelName || channel.channelName;
    channel.description = description || channel.description;
    channel.channelBanner = channelBanner || channel.channelBanner;

    await channel.save();

    res.status(200).json({
      message: "Channel updated successfully",
      channel: channel,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

export default router;
