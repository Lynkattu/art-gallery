import jwt from 'jsonwebtoken';

const authentication = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      req.user = user;
      next();
    });
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default authentication;