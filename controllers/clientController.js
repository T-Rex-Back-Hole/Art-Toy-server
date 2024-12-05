import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../models/Client.js";

export const registerClient = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newClient = new Client({ name, email, password: hashedPassword });
    await newClient.save();

    res.status(201).json({
      success: true,
      message: "Client registered successfully.",
      client: {
        id: newClient._id,
        name: newClient.name,
        email: newClient.email,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
};

export const loginClient = async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await Client.findOne({ email });
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
      .cookie("token", token, { httpOnly: true, secure: false })
      .status(200)
      .json({
        success: true,
        message: "Login successful.",
        client: { id: client._id, name: client.name, email: client.email },
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
    .json({ success: true, message: "Logout successful." });
};
