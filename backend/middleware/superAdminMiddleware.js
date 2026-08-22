// const superAdminMiddleware = (req, res, next) => {
//   if (req.user.role !== "SUPER_ADMIN") {
//     return res.status(403).json({
//       success: false,
//       message: "Only Super Admin can perform this action.",
//     });
//   }

//   next();
// };

// module.exports = superAdminMiddleware;

const superAdminMiddleware = (req, res, next) => {
  if (
    req.user.role !== "SUPER_ADMIN" &&
    req.user.role !== "EMPLOYEE"
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  }

  next();
};

module.exports = superAdminMiddleware;