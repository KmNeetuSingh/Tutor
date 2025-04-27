  const roleMiddleware = (allowedRoles) => (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "User role not found" });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Required role: " + allowedRoles.join(", ") });
    }
    
    next();
  };

  module.exports = roleMiddleware;
