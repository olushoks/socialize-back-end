const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send(`Access Denied. No token provided.`);

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(400).send(`Invalid token.`);
  }
}

module.exports = auth;
