import jwt from "jsonwebtoken";

// Middleware to protect routes that require authentication
// Checks if a valid JWT token is present in the request header
const protect = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "No token provided. Please login first.",
    });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request object
    req.userId = decoded.id;
    req.username = decoded.username;

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token. Please login again.",
    });
  }
};

export default protect;
