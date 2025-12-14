module.exports = (req, res, next) => {
  // req.user is set by auth middleware
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  next();
};
