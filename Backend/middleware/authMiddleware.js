// authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log('=== Auth Middleware ===');
  const authHeader = req.headers.authorization;

  // Check if authorization header is provided
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing or invalid" });
  }

  // Extract token from the authorization header
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token is missing from authorization header" });
  }

  try {
    // Verify the token using the secret stored in the environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Handle token errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role checking middleware function
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Check if the user role is available in the decoded token (attached by authMiddleware)
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "User role not found" });
    }

    // Check if the user's role is allowed to access the route
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
      });
    }

    next(); // Proceed if the role is allowed
  };
};

module.exports = { authMiddleware, checkRole };
