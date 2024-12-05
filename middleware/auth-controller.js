import Client from "../models/Client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerClient = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkClient = await Client.findOne({ email });
    if (checkClient)
      return res.json({
        success: false,
        message: "Client Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newClient = new Client({
      name,
      email,
      password: hashPassword,
    });
    await newClient.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkClient = await Client.findOne({ email });
    if (!checkClient)
      return res.json({
        success: false,
        message: "Client doesn't exist! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkClient.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkClient._id,
        email: checkClient.email,
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      client: {
        email: checkClient.email,
        id: checkClient._id,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const logoutClient = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });

  try {
    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    req.client = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

export { registerClient, loginClient, logoutClient, authMiddleware };
