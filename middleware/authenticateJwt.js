import jwt from "jsonwebtoken";

const secret = process.env.SECRET_KEY;

const authenticateJwt = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(403).json({ message: "Token missing" });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

export default authenticateJwt;
