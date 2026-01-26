const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization; // "Bearer <token>"
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: payload.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
