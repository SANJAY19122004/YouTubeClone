// Import required modules using ES Modules syntax
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import all routes
import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS so frontend can communicate with backend
app.use(cors());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register all routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/comments", commentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.message);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
