const { verifyAdminToken } = require("../utils/adminAuth");

module.exports = function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Admin authentication required." });
  }

  const admin = verifyAdminToken(token);

  if (!admin) {
    return res.status(401).json({ error: "Invalid or expired admin session." });
  }

  req.admin = admin;
  next();
};
