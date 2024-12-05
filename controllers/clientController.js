import Client from '../models/client.js';
import jwt from 'jsonwebtoken';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const register = async (req, res) => {
  try {
    const newClient = await Client.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    const token = signToken(newClient._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        client: newClient
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'กรุณากรอกอีเมลและรหัสผ่าน'
      });
    }

    const client = await Client.findOne({ email }).select('+password');

    if (!client || !(await client.correctPassword(password, client.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    const token = signToken(client._id);

    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

export const logoutClient = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logout successful." });
};
