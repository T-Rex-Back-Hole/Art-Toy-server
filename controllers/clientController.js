import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const registerClient = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    console.log("Register attempt:", { userName, email });

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role: "user"
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};

export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password"
      });
    }

    const client = await User.findOne({ email });
    console.log('Found client:', client ? 'Yes' : 'No');

    if (!client) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { 
        id: client._id,
        email: client.email,
        userName: client.userName
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "60m" }
    );

    console.log('Token generated successfully');

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      userData: {
        id: client._id,
        userName: client.userName,
        email: client.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error: error.message
    });
  }
};

export const logoutClient = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ 
      success: true, 
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Error logging out"
    });
  }
};

export const getClientProfile = async (req, res) => {
  try {
    const userID = req.client.id;
    const user = await User.findById(userID).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      userData: {
        userName: user.userName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile"
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.client.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password"
      });
    }

    const client = await User.findById(userId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, client.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    client.password = hashedPassword;
    await client.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message
    });
  }
};

