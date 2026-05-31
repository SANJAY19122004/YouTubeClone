import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate all required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Username, email and password are required",
      });
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Please enter a valid email address",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Password must be at least 6 characters",
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Username already taken",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Email already registered",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// POST /api/auth/login - Login user and return JWT token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "No account found with this email",
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Incorrect password",
      });
    }

    // Generate JWT token valid for 7 days
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        channels: user.channels,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

// GET /api/auth/me - Get current logged in user details
router.get("/me", async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id from token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
});

export default router;
