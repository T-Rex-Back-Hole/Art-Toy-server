import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const registerClient = async (req, res) => {
  const { userName, email, password, role } = req.body;
  const assignedRole = role && ["admin", "user"].includes(role) ? role : "user";

  try {
    // Check if the client already exists
    const existingClient = await User.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client already exists with this email.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new client
    const newClient = new User({
      userName,
      email,
      role: assignedRole,
      password: hashedPassword,
    });

    // Save the client to the database
    await newClient.save();

    res.status(201).json({
      success: true,
      message: "Client registered successfully.",
      client: {
        id: newClient._id,
        userName: newClient.userName,
        email: newClient.email,
        role: newClient.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
};

export const loginClient = async (req, res) => {
  const { email, password, } = req.body;
  try {
    // Find the user by email
    const client = await User.findOne({ email });
    if (!client) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found." });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: client._id, email: client.email },
      process.env.CLIENT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("token", token, { httpOnly: true, secure: false }) // `secure: true` for HTTPS production
      .status(200)
      .json({
        success: true,
        message: "Login successful.👌👌",
        client: {
          id: client._id,
          userName: client.userName,
          email: client.email,
        },
      });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Login failed." });
  }
};

export const logoutClient = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logout successful.😎 😎 😎" });
};
