import jwt from 'jsonwebtoken';
import tokenBlacklistModel from './models/blacklist.model.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from headers or cookies
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    // Check if token is blacklisted
    const isBlacklisted = await tokenBlacklistModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token has been blacklisted, please login again",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default authMiddleware;
