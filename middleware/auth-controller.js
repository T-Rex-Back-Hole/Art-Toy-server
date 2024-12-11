import jwt from "jsonwebtoken";
import Client from '../models/User.js';

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

const checkAuth = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found"
      });
    }

    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    
    return res.status(200).json({
      success: true,
      user: decoded
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired"
    });
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user!"
      });
    }

    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    req.client = decoded;
    next();
    
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({
      success: false,
      message: "Unauthorized user!"
    });
  }
};

export { checkAuth, authMiddleware };
