const superAdminMiddleware = (req, res, next) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Only Super Admin can perform this action.",
    });
  }

  next();
};

module.exports = superAdminMiddleware;