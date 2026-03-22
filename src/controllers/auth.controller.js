const userModel = require("../models/user.model");
const config = require("../db/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.Register = async (req, res) => {
  let { username, email, password } = req.body;

  if (!password || !email || !username) {
    return res.status(401).json({ message: "All fields are required" });
  }

  let isAlreadyRegister = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isAlreadyRegister) {
    res.status(409).json({ message: "Username or email alredy exist" });
  }

  const hashedPass = await bcrypt.hash(password, 10);
  const user = new userModel({
    email,
    username,
    password: hashedPass,
  });
  await user.save();

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(201).json({
    message: "user register successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  });

  req.cookie("token", token);
};

module.exports.Login = async (req, res) => {
  let { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  });
};
