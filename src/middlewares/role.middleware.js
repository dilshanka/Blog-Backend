// module.exports = (allowedRoles = []) => {
//   return (req, res, next) => {
//     if (!req.user) return res.status(401).json({ message: "Not authenticated" });
//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Forbidden: insufficient role" });
//     }
//     next();
//   };
// };

module.exports = (req, res, next) => {
  console.log("Checking admin role for user:", req.user);
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

