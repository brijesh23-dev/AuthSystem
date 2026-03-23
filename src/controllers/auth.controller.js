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

  const accessToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    message: "user register successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
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

module.exports.getme = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decode = jwt.verify(token, config.JWT_SECRET);

  const user = await userModel.findById(decode.id);

  res.status(200).json({
    message: "User fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

module.exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decode = jwt.verify(refreshToken, config.JWT_SECRET);
  const acessToken = jwt.sign({ id: decode.id }, config.JWT_SECRET, {
    expiresIn: "15m",
  });

  const newRefreshToken = jwt.sign({ id: decode.id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  
  res.status(200).json({
    message: "Access token refreshed successfully",
    accessToken: acessToken,
  });


  const user = await userModel.findById(decode.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
};
