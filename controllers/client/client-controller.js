const bcrypt = require("bcrypt");
const Client = require("../../models/Client");

// ฟังก์ชันสำหรับการลงทะเบียน Client
const registerClient = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client already exists with this email.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newClient = new Client({
      name,
      email,
      password: hashedPassword,
    });

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
    console.error("Error occurred during registration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register client.",
    });
  }
};

const loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingClient = await Client.findOne({ email });
    if (!existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client does not exist with this email.",
      });
    }

    const match = await bcrypt.compare(password, existingClient.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client logged in successfully.",
      client: {
        id: existingClient._id,
        name: existingClient.name,
        email: existingClient.email,
      },
    });
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login client.",
    });
  }
};

module.exports = { registerClient, loginClient };
